require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const pino = require('pino');
const { createClient } = require('@supabase/supabase-js');
const LocalBrainService = require('./lib/localBrain');
const AuthBackup = require('./lib/authBackup');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
const authBackup = new AuthBackup(supabase);

app.use(express.static('public'));
app.use(express.json());

let sock, gemini, localBuffer = {};
const authPath = path.join(__dirname, 'auth_info_baileys');

const defaultPersona = `You are Mjomba Assistant for Mjomba's Texas Grill. Professional, witty, and passionate about meat. 🥩🔥 Signatures: "Welcome 😎🔥 This is not just a menu… it’s a life decision." / "MJOMBA will guide you like a meat doctor 🥼🔥". Steaks are 18,000 Tsh. Thursday Special 15k. Tuesday CLOSED.`;

async function fetchCloudBrain() {
    try {
        const { data } = await supabase.from('bot_settings').select('key, value').timeout(4000); 
        const brain = {};
        if (data) {
            data.forEach(s => brain[s.key] = s.value);
            gemini = new LocalBrainService();
        } else { gemini = new LocalBrainService(); }
    } catch (e) { gemini = new LocalBrainService(); }
}

async function startBot(isPairing = false, phone = null) {
    if (isPairing) {
        if (sock) { try { sock.end(); } catch (e) {} sock = null; }
        if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        // Background Cleanup (Non-awaited for Turbo speed)
        supabase.storage.from('bot-auth').remove(['session.zip']).then(() => {});
    } else {
        await authBackup.downloadSession(authPath);
    }
    
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    sock = makeWASocket({
        version: (await fetchLatestBaileysVersion()).version,
        auth: state, logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Chrome')
    });

    if (isPairing && phone) {
        await delay(5000); // Wait for connection
        const code = await sock.requestPairingCode(phone);
        io.emit('code', code);
    }

    sock.ev.on('creds.update', async () => {
        try { await saveCreds(); authBackup.uploadSession(authPath).catch(err => {}); } catch (e) {}
    });

    sock.ev.on('connection.update', (u) => {
        const { connection, qr } = u;
        if (qr) io.emit('qr', qr);
        if (connection === 'open') {
            io.emit('status', 'Connected');
            console.log('Mjomba Assistant Alive!');
        } else if (connection === 'close') {
            setTimeout(startBot, 5000);
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const jid = msg.key.remoteJid;
        const name = msg.pushName || 'Customer';

        // SCREENSHOT / PAYMENT INTERCEPTOR
        if (msg.message.imageMessage) {
            try {
                const buffer = await downloadMediaMessage(msg, 'buffer', { }, { logger: pino({ level: 'silent' }) });
                const bossJid = process.env.MANAGER_NUMBER + '@s.whatsapp.net';
                await sock.sendMessage(bossJid, { 
                    image: buffer, 
                    caption: `🚨 *MALIPO MAPYA (SCREENSHOT)* 🚨\n👤 *Kutoka*: ${name}\n📞 *Namba*: ${jid.split('@')[0]}\n\nAngalia muamala huu na u-confirm order!` 
                });
                await sock.sendMessage(jid, { text: "Asante! 🙏 Screenshot ya malipo imetumwa kwa Mjomba.\n\nGrill inawashwa sasa hivi... tutakupa taarifa mzigo ukiwa tayari! Nyama Bila Drama! 🥩🔥" });
            } catch (err) {
                console.error("[IMAGE FORWARD ERROR]", err);
            }
            return;
        }

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!text || !gemini) return;

        io.emit('log', `${name}: ${text}`);
        supabase.from('messages').insert([{ sender: jid, sender_name: name, content: text, type: 'incoming' }]).then(() => {});

        if (!localBuffer[jid]) {
            try {
                const { data: raw } = await supabase.from('messages')
                    .select('content, type')
                    .or(`sender.eq.${jid},reply_to.eq.${jid}`)
                    .order('created_at', { ascending: false }).limit(6).timeout(3000);
                localBuffer[jid] = raw ? raw.filter(h => !h.content.includes("Issue:")).reverse().map(h => ({
                    role: h.type === 'incoming' ? 'user' : 'model',
                    parts: [{ text: h.content }]
                })) : [];
            } catch (e) { localBuffer[jid] = []; }
        }

        try {
            const res = await gemini.getResponseFromHistory(text, localBuffer[jid]);
            await sock.sendMessage(jid, { text: res });
            io.emit('log', `Bot: ${res}`);
            
            localBuffer[jid].push({ role: 'user', parts: [{ text }] });
            localBuffer[jid].push({ role: 'model', parts: [{ text: res }] });
            if (localBuffer[jid].length > 6) localBuffer[jid].shift();
            supabase.from('messages').insert([{ sender: 'BOT', content: res, type: 'outgoing', reply_to: jid }]).then(() => {});
        } catch (e) {}
    });
}

// REST ENDPOINTS
app.get('/logout', async (req, res) => {
    console.log('[RESET] Instant Manual Logout Triggered');
    if (sock) { try { sock.end(); } catch (e) {} sock = null; }
    if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
    // Parallel Cloud Clean
    supabase.storage.from('bot-auth').remove(['session.zip']).then(() => {});
    res.json({ success: true });
});

app.get('/request-pairing', async (req, res) => {
    const { phone } = req.query;
    startBot(true, phone);
    res.json({ success: true });
});

setInterval(() => { if (sock) io.emit('log', `System Pulse: OK at ${new Date().toLocaleTimeString()}`); }, 30000);

const PORT = 3002;
server.listen(PORT, async () => {
    console.log(`Mjomba Reliable Hub: http://localhost:${PORT}`);
    await fetchCloudBrain();
    startBot();
});
