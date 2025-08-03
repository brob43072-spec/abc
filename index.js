// Import required modules
const express = require('express');
const { default: makeWASocket, useSingleFileAuthState } = require('@adiwajshing/baileys'); // or your bot framework
const { Boom } = require('@hapi/boom');
const dotenv = require('dotenv');
dotenv.config();

// Start WhatsApp connection (Replace with your bot code)
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async (msg) => {
    console.log('Received message:', msg);

    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;

    const sender = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text;

    if (text === '!ping') {
      await sock.sendMessage(sender, { text: 'pong 🏓' });
    }
  });
}

startBot();

// Express server for UptimeRobot
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive! 🟢');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Web server running on port ${PORT}`));
