const { cmd } = require('../command');

// shared contextInfo
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
  pattern: "block",
  desc: "Blocks a person",
  category: "owner",
  react: "🚫",
  filename: __filename
}, async (conn, m, { reply, q, react }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  if (m.sender !== botOwner) {
    await react("❌");
    return conn.sendMessage(m.chat, {
      text: "Only the bot owner can use this command.",
      contextInfo
    }, { quoted: m });
  }

  let jid;
  if (m.quoted) {
    jid = m.quoted.sender;
  } else if (m.mentionedJid.length > 0) {
    jid = m.mentionedJid[0];
  } else if (q && q.includes("@")) {
    jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
  } else {
    await react("❌");
    return conn.sendMessage(m.chat, {
      text: "Please mention a user or reply to their message.",
      contextInfo
    }, { quoted: m });
  }

  try {
    await conn.updateBlockStatus(jid, "block");
    await react("✅");
    await conn.sendMessage(m.chat, {
      text: `✅ Successfully blocked @${jid.split("@")[0]}`,
      mentions: [jid],
      contextInfo
    }, { quoted: m });
  } catch (error) {
    console.error("Block command error:", error);
    await react("❌");
    await conn.sendMessage(m.chat, {
      text: "❌ Failed to block the user.",
      contextInfo
    }, { quoted: m });
  }
});

cmd({
  pattern: "unblock",
  desc: "Unblocks a person",
  category: "owner",
  react: "🔓",
  filename: __filename
}, async (conn, m, { reply, q, react }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  if (m.sender !== botOwner) {
    await react("❌");
    return conn.sendMessage(m.chat, {
      text: "Only the bot owner can use this command.",
      contextInfo
    }, { quoted: m });
  }

  let jid;
  if (m.quoted) {
    jid = m.quoted.sender;
  } else if (m.mentionedJid.length > 0) {
    jid = m.mentionedJid[0];
  } else if (q && q.includes("@")) {
    jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
  } else {
    await react("❌");
    return conn.sendMessage(m.chat, {
      text: "Please mention a user or reply to their message.",
      contextInfo
    }, { quoted: m });
  }

  try {
    await conn.updateBlockStatus(jid, "unblock");
    await react("✅");
    await conn.sendMessage(m.chat, {
      text: `🔓 Successfully unblocked @${jid.split("@")[0]}`,
      mentions: [jid],
      contextInfo
    }, { quoted: m });
  } catch (error) {
    console.error("Unblock command error:", error);
    await react("❌");
    await conn.sendMessage(m.chat, {
      text: "❌ Failed to unblock the user.",
      contextInfo
    }, { quoted: m });
  }
});