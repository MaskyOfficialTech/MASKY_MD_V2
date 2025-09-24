const { cmd } = require("../command");
const axios = require("axios");
const getRandomMenuImage = require("../menuImages"); // import random menu image
const config = require("../config"); // import config

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
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from, sender }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply(
                "🖼️ Please provide a search query\nExample: .img cute cats",
                { contextInfo: setContext(sender), quoted: m, image: getRandomMenuImage() }
            );
        }

        await reply(
            `🔍 Searching images for "${query}"...`,
            { contextInfo: setContext(sender), quoted: m, image: getRandomMenuImage() }
        );

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        // Validate response
        if (!response.data?.success || !response.data.results?.length) {
            return reply(
                "❌ No images found. Try different keywords",
                { contextInfo: setContext(sender), quoted: m, image: getRandomMenuImage() }
            );
        }

        const results = response.data.results;
        // Get 5 random images
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `📷 Result for: ${query}\n> © > *𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐦𝐚𝐬𝐤𝐲 𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐭𝐞𝐜𝐡*`,
                    contextInfo: setContext(sender)
                },
                { quoted: mek }
            );
            // Add delay between sends to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        reply(
            `❌ Error: ${error.message || "Failed to fetch images"}`,
            { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() }
        );
    }
});