const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config'); // import config

// single reusable contextInfo
const contextInfo = {
  mentionedJid: [],
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363423221401585@newsletter',
    newsletterName: config.OWNER_NAME,
    serverMessageId: 143
  }
};

// helper to set mentionedJid dynamically
function setContext(sender) {
  contextInfo.mentionedJid = [sender];
  return contextInfo;
}

cmd({
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "Download a YouTube community post",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply(
            "Please provide a YouTube community post URL.\nExample: `.ytpost <url>`",
            { contextInfo: setContext(sender), quoted: m }
        );

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await react("❌");
            return reply(
                "Failed to fetch the community post. Please check the URL.",
                { contextInfo: setContext(sender), quoted: m }
            );
        }

        const post = data.data;
        let caption = `📢 *YouTube Community Post* 📢\n\n` +
                      `📜 *Content:* ${post.content}`;

        if (post.images && post.images.length > 0) {
            for (const img of post.images) {
                await conn.sendMessage(from, { image: { url: img }, caption, contextInfo: setContext(sender) }, { quoted: mek });
                caption = ""; // Only add caption once, images follow
            }
        } else {
            await conn.sendMessage(from, { text: caption, contextInfo: setContext(sender) }, { quoted: mek });
        }

        await react("✅");
    } catch (e) {
        console.error("Error in ytpost command:", e);
        await react("❌");
        reply(
            "An error occurred while fetching the YouTube community post.",
            { contextInfo: setContext(m.sender), quoted: m }
        );
    }
});