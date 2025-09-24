const { cmd } = require('../command');

const bibleVersions = {
  kjv: "King James Version",
  niv: "New International Version",
  nlt: "New Living Translation",
  esv: "English Standard Version",
  msg: "The Message",
  nasb: "New American Standard Bible",
  ceb: "Common English Bible"
};

// helper contextInfo
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363423221401585@newsletter',
    newsletterName: 'MASKY MD',
    serverMessageId: 143
  }
};// BIBLELIST COMMAND
cmd({
  pattern: "biblelist",
  alias: ["blist", "versions"],
  react: "📚",
  desc: "List available Bible versions",
  category: "bible",
  filename: __filename
}, async (conn, m, { from, reply }) => {
  try {
    const listText = `*📚 Available Bible Versions*\n\n` +
      `- KJV (default)\n- NIV\n- ESV\n- NLT\n- MSG\n\n` +
      `👉 Usage:\n.bible John 3:16\n.bible NIV John 3:16`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/q43u5w.jpg" },
      caption: listText,
      contextInfo
    }, { quoted: m });

  } catch (e) {
    console.error("Biblelist command error:", e);
    reply("⚠️ Failed to fetch Bible versions.");
  }
});

module.exports = bibleVersions;