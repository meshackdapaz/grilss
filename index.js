const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const pino = require('pino');

async function startBot() {
    // Fetch the latest version dynamically
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    // Session state
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info_baileys'));

    // Initialize the socket
    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'debug' }) 
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    // Connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('--- QR CODE GENERATED ---');
            // Save as text for the agent to read
            fs.writeFileSync(path.join(__dirname, 'qr.txt'), qr);
            // Save as image for the user to scan (higher scale for better detection)
            QRCode.toFile(path.join(__dirname, 'qr.png'), qr, {
                scale: 8,
                margin: 4,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            // Display in terminal for debug
            qrcode.generate(qr, { small: true });
            console.log('QR code saved to qr.txt and qr.png');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) 
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut 
                : true;
            
            console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log('OH YEAH! Connection opened!');
            console.log('Bot is ready to receive messages.');
        }
    });

    // Handle messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        console.log(`Message from ${remoteJid}: ${text}`);

        // Commands
        if (text === '!ping') {
            await sock.sendMessage(remoteJid, { text: 'pong' });
        } else if (text === '!help') {
            await sock.sendMessage(remoteJid, { text: 'Hello! I am your WhatsApp Bot.\nCommands:\n!ping - responds with pong\n!help - shows this message' });
        } else if (text.startsWith('!echo ')) {
            const echoText = text.slice(6);
            await sock.sendMessage(remoteJid, { text: echoText });
        }
    });
}

// Run the bot
startBot().catch(err => console.error("Critical error:", err));
