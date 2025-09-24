/*
  SAFE / READABLE VERSION:
  - Harmful SMS-bombing network calls removed.
  - Command still checks owner and parses target number for maintenance/learning.
  - Replies now include contextInfo (MASKY MD).
*/

const { cmd } = require('../command');

// Updated contextInfo used across replies
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363423221401585@newsletter',
    newsletterName: 'MASKY MD',
    serverMessageId: 143
  }
};

cmd({
  pattern: 'bomb',                         // original command name
  react: '💣',
  desc: 'Trigger SMS bombing (Owner Only) - DISABLED (safe version)',
  category: 'main',
  filename: __filename
}, async (conn, m, args, { from, isOwner }) => {
  // helper to send replies with contextInfo and quoted message
  const sendReply = (payload) => {
    // payload can be string (text) or an object matching Baileys message body
    if (typeof payload === 'string') {
      return conn.sendMessage(from, { text: payload, contextInfo }, { quoted: m });
    }
    // if payload is an object already (e.g., { text: '...' })
    return conn.sendMessage(from, { ...payload, contextInfo }, { quoted: m });
  };

  try {
    // Owner check (unchanged)
    if (!isOwner) {
      return sendReply('❌ Only bot owner can use this command!');
    }

    // Determine the target phone number:
    const mentioned = (m?.mentionedJid && m.mentionedJid[0]) || (m?.sender) || (args && args[0]);

    if (!mentioned) {
      return sendReply('Usage: !bomb 923001234567');
    }

    // Clean the jid to a plain number if it looks like a WhatsApp JID:
    const number = String(mentioned).replace('@s.whatsapp.net', '');

    // SAFE RESPONSE (no external calls)
    return sendReply({
      text:
        '⚠️ Action disabled — harmful functionality removed.\n\n' +
        `Target number parsed: *${number}*\n\n` +
        '_Note: The original script attempted to call a remote SMS API. That behavior has been removed to prevent abuse._'
    });

  } catch (err) {
    console.error('bomb command error:', err);
    const msg = (err && err.message) ? err.message : String(err);
    return sendReply({ text: '⚠️ Error: ' + msg });
  }
});