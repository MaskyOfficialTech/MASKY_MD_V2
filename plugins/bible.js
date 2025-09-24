const { cmd } = require('../command');
const fetch = require('node-fetch');
const bibleVersions = require('./biblelist');

// helper contextInfo
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363423221401585@newsletter',
    newsletterName: 'MASKY MD',
    serverMessageId: 143
  }
};

// BIBLE COMMAND
cmd({
  pattern: "bible",
  alias: ["verse", "scripture"],
  react: "📖",
  desc: "Get a Bible verse by reference (default KJV)",
  category: "bible",
  filename: __filename
}, async (conn, m, { from, q, reply }) => {
  try {
    if (!q) return reply("Usage: .bible John 3:16 OR\n you can add your use bible version with before typing the chapter as you see NIV =  is New International Version \n.bible NIV John 3:16");

    const parts = q.split(" ");
    let version = "KJV"; // default
    let verseRef;

    if (parts[0].match(/^[A-Za-z]+$/) && parts[0].length <= 5) {
      version = parts[0].toUpperCase();
      verseRef = parts.slice(1).join(" ");
    } else {
      verseRef = q;
    }

    if (!verseRef) return reply("❎ Please provide a Bible verse reference.");

    const url = `https://bible-api.com/${encodeURIComponent(verseRef)}?translation=${version}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.text) return reply("❌ Verse not found or invalid reference.");

    const verseText = `*📖 ${data.reference}* (${version})\n\n${data.text}`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/q43u5w.jpg" },
      caption: verseText,
      contextInfo
    }, { quoted: m });

  } catch (e) {
    console.error("Bible command error:", e);
    reply("⚠️ Failed to fetch Bible verse.");
  }
});

