const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');
const config = require('../config');

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

// --- Twitter Downloader ---
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply, sender }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("❌ Please provide a valid Twitter URL.", { contextInfo: setContext(sender), quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key }, contextInfo: setContext(sender) });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data?.status || !data?.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.", { contextInfo: setContext(sender), quoted: m });
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *Description:* ${desc || "No description"}\n`
      + `╰━━━⪼\n\n`
      + `📹 *Download Options:*\n`
      + `1️⃣  *SD Quality*\n`
      + `2️⃣  *HD Quality*\n`
      + `🎵 *Audio Options:*\n`
      + `3️⃣  *Audio*\n`
      + `4️⃣  *Document*\n`
      + `5️⃣  *Voice*\n\n`
      + `📌 *Reply with the number to download your choice.*\n\n*𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐦𝐚𝐬𝐤𝐲 𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐭𝐞𝐜𝐡*`;

    const sentMsg = await conn.sendMessage(from, { image: { url: thumb }, caption, contextInfo: setContext(sender) }, { quoted: m });
    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⬇️', key: receivedMsg.key }, contextInfo: setContext(senderID) });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, { video: { url: video_sd }, caption: "📥 *Downloaded in SD Quality*", contextInfo: setContext(senderID) }, { quoted: receivedMsg });
            break;
          case "2":
            await conn.sendMessage(senderID, { video: { url: video_hd }, caption: "📥 *Downloaded in HD Quality*", contextInfo: setContext(senderID) }, { quoted: receivedMsg });
            break;
          case "3":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mpeg", contextInfo: setContext(senderID) }, { quoted: receivedMsg });
            break;
          case "4":
            await conn.sendMessage(senderID, { document: { url: video_sd }, mimetype: "audio/mpeg", fileName: "Twitter_Audio.mp3", caption: "📥 *Audio Downloaded as Document*", contextInfo: setContext(senderID) }, { quoted: receivedMsg });
            break;
          case "5":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mp4", ptt: true, contextInfo: setContext(senderID) }, { quoted: receivedMsg });
            break;
          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.", { contextInfo: setContext(senderID), quoted: receivedMsg });
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.", { contextInfo: setContext(m.sender), quoted: m });
  }
});

// --- MediaFire Downloader ---
cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply, sender }) => {
  try {
    if (!q) return reply("❌ Please provide a valid MediaFire link.", { contextInfo: setContext(sender), quoted: m });

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key }, contextInfo: setContext(sender) });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data?.status || !data?.result?.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.", { contextInfo: setContext(sender), quoted: m });
    }

    const { dl_link, fileName, fileType } = data.result;
    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key }, contextInfo: setContext(sender) });

    const caption = `╭━━━〔 *MEDIAFIRE DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *File Name:* ${fileName || "mediafire_download"}\n`
      + `┃▸ *File Type:* ${fileType || "application/octet-stream"}\n`
      + `╰━━━⪼\n\n`
      + `📥 *Downloading your file...*\n\n*𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐦𝐚𝐬𝐤𝐲 𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐭𝐞𝐜𝐡*`;

    await conn.sendMessage(from, { document: { url: dl_link }, mimetype: fileType, fileName, caption, contextInfo: setContext(sender) }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.", { contextInfo: setContext(m.sender), quoted: m });
  }
});

// --- Repeat similar pattern for APK, G-Drive, TikTok, IGDL, FB etc ---
// Just ensure every reply has { contextInfo: setContext(sender), quoted: m } and branding text updated