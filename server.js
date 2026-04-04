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

let isFirstStart = true;
async function startBot(isPairing = false, phone = null, fromReconnect = false) {
    if (isPairing) {
        console.log('[SHOE] Starting deep pairing RESET...');
        if (sock) { try { sock.end(); } catch (e) {} sock = null; }
        if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        // Background Cleanup (Non-awaited for Turbo speed)
        supabase.storage.from('bot-auth').remove(['session.zip']).then(() => {});
    } else if (isFirstStart && !fromReconnect) {
        console.log('[SYNC] First start: Downloading session from cloud...');
        await authBackup.downloadSession(authPath);
        isFirstStart = false; // Never download again in this process unless we crash
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

    sock.ev.on('connection.update', async (u) => {
        const { connection, lastDisconnect, qr } = u;
        if (qr) io.emit('qr', qr);
        
        if (connection === 'open') {
            io.emit('status', 'Connected');
            console.log('Mjomba Assistant Alive!');
            // Save a fresh backup once connection is fully established
            await authBackup.uploadSession(authPath).catch(() => {});
        } else if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('[CONN] Closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                // IMPORTANT: Re-start without re-downloading the cloud session 
                // to use what's already in the local auth folder
                setTimeout(() => startBot(false, null, true), 5000);
            } else {
                console.log('[CONN] Logged out. Manual re-pairing required.');
                io.emit('status', 'Logged Out');
                if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
            }
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const { messages, type } = m;
        // Dashboard Debug: Let the user know we see SOMETHING coming in
        io.emit('log', `📥 Received ${messages.length} signals (Type: ${type})`);

        await Promise.all(messages.map(async (msg) => {
            try {
                // Check if from self
                if (msg.key.fromMe) {
                    io.emit('log', `⏳ Skipping message from your own phone (self-test)`);
                    return;
                }
                if (!msg.message) return;
                
                const jid = msg.key.remoteJid;
                const name = msg.pushName || 'Customer';

                // Deep Text Extraction (Handles buttons, ads, and standard text)
                const text = msg.message.conversation || 
                             msg.message.extendedTextMessage?.text || 
                             msg.message.buttonsResponseMessage?.selectedDisplayText || 
                             msg.message.templateButtonReplyMessage?.selectedId ||
                             '';

                // Handle Images (Payments) - Priority #1
                if (msg.message.imageMessage) {
                    io.emit('log', `📸 [IMAGE] Payment screenshot detected from ${name}`);
                    try {
                        const buffer = await downloadMediaMessage(msg, 'buffer', { }, { logger: pino({ level: 'silent' }) });
                        const bossJid = process.env.MANAGER_NUMBER + '@s.whatsapp.net';
                        await sock.sendMessage(bossJid, { 
                            image: buffer, 
                            caption: `🚨 *MALIPO MAPYA (SCREENSHOT)* 🚨\n👤 *Kutoka*: ${name}\n📞 *Namba*: ${jid.split('@')[0]}\n\nAngalia muamala huu na u-confirm order!` 
                        });
                        await sock.sendMessage(jid, { text: "Asante! 🙏 Screenshot ya malipo imetumwa kwa Mjomba.\n\nGrill inawashwa sasa hivi... tutakupa taarifa mzigo ukiwa tayari! Nyama Bila Drama! 🥩🔥" });
                    } catch (err) { console.error("[IMAGE FORWARD ERROR]", err); }
                    return;
                }

                if (!text) {
                    io.emit('log', `❓ [EMPTY] No readable text found in signal from ${name}`);
                    return;
                }

                if (!gemini) {
                    io.emit('log', `🧠 [ERROR] Bot Brain not initialized yet!`);
                    return;
                }

                // Log & Tracking
                io.emit('log', `📩 [IN] ${name}: ${text}`);
                supabase.from('messages').insert([{ sender: jid, sender_name: name, content: text, type: 'incoming' }]).then(() => {});

                // Context Retrieval
                if (!localBuffer[jid]) {
                    const { data: raw } = await supabase.from('messages')
                        .select('content, type')
                        .order('created_at', { ascending: false }).limit(6).timeout(3000);
                    localBuffer[jid] = raw ? raw.reverse().map(h => ({
                        role: h.type === 'incoming' ? 'user' : 'model',
                        parts: [{ text: h.content }]
                    })) : [];
                }

                // Generate and Send Response
                const res = await gemini.getResponseFromHistory(text, localBuffer[jid]);
                await sock.sendMessage(jid, { text: res });
                io.emit('log', `📤 [OUT] Bot: ${res}`);
                
                // Buffer Management
                localBuffer[jid].push({ role: 'user', parts: [{ text }] });
                localBuffer[jid].push({ role: 'model', parts: [{ text: res }] });
                if (localBuffer[jid].length > 6) localBuffer[jid].shift();
                
                // History Logging
                supabase.from('messages').insert([{ sender: 'BOT', content: res, type: 'outgoing', reply_to: jid }]).then(() => {});
            } catch (e) {
                console.error("[DEEP DIAG ERROR]", e.message);
                io.emit('log', `❌ [SYSTEM ERROR] ${e.message}`);
            }
        }));
    });
}

// REST ENDPOINTS
app.get('/logout', async (req, res) => {
    console.log('[RESET] Instant Manual Logout Triggered');
    if (sock) { 
        try { await sock.logout(); } catch (e) {} // Tells WhatsApp to instantly remove the linked device from your phone!
        try { sock.end(); } catch (e) {} 
        sock = null; 
    }
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

const PORT = process.env.PORT || 3002;
server.listen(PORT, async () => {
    console.log(`Mjomba Reliable Hub: http://localhost:${PORT}`);
    await fetchCloudBrain();
    startBot();
});
