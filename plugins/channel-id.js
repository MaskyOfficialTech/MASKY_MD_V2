const { cmd } = require("../command");
const config = require("../config");

// Shared contextInfo
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
  pattern: "chid",
  alias: ["newsletter", "channelid"],
  react: "📡",
  desc: "Get WhatsApp Channel info from link",
  category: "whatsapp",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
  try {
    const sendReply = (msg) => {
      return conn.sendMessage(from, { text: msg, contextInfo }, { quoted: m });
    };

    if (!q) {
      return sendReply("❎ Please provide a WhatsApp Channel link.\n\n*Example:* .cinfo https://whatsapp.com/channel/123456789");
    }

    const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) {
      return sendReply("⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx");
    }

    const inviteId = match[1];

    let metadata;
    try {
      metadata = await conn.newsletterMetadata("invite", inviteId);
    } catch (e) {
      return sendReply("❌ Failed to fetch channel metadata. Make sure the link is correct.");
    }

    if (!metadata || !metadata.id) {
      return sendReply("❌ Channel not found or inaccessible.");
    }

    const infoText = `*— 乂 Channel Info —*\n\n` +
      `🆔 *ID:* ${metadata.id}\n` +
      `📌 *Name:* ${metadata.name}\n` +
      `👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
      `📅 *Created on:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID") : "Unknown"}`;

    if (metadata.preview) {
      await conn.sendMessage(from, {
        image: { url: `https://pps.whatsapp.net${metadata.preview}` },
        caption: infoText,
        contextInfo
      }, { quoted: m });
    } else {
      return sendReply(infoText);
    }

  } catch (error) {
    console.error("❌ Error in .cinfo plugin:", error);
    return conn.sendMessage(from, {
      text: "⚠️ An unexpected error occurred.",
      contextInfo
    }, { quoted: m });
  }
});