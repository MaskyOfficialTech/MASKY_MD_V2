const { cmd } = require("../command");
const { fetchEmix } = require("../lib/emix-utils");
const { getBuffer } = require("../lib/functions");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

// reusable contextInfo
const contextInfo = {
    mentionedJid: [],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363423221401585@newsletter',
        newsletterName: 'MASKY MD',
        serverMessageId: 143
    }
};

// helper to dynamically set mentionedJid
function setContext(sender) {
    contextInfo.mentionedJid = [sender];
    return contextInfo;
}

cmd({
    pattern: "emix",
    desc: "Combine two emojis into a sticker.",
    category: "fun",
    react: "😃",
    use: ".emix 😂,🙂",
    filename: __filename,
}, async (conn, mek, m, { args, q, reply, sender }) => {
    try {
        if (!q.includes(",")) {
            return reply(
                "❌ *Usage:* .emix 😂,🙂\n_Send two emojis separated by a comma._",
                { contextInfo: setContext(sender), quoted: mek }
            );
        }

        let [emoji1, emoji2] = q.split(",").map(e => e.trim());

        if (!emoji1 || !emoji2) {
            return reply(
                "❌ Please provide two emojis separated by a comma.",
                { contextInfo: setContext(sender), quoted: mek }
            );
        }

        let imageUrl = await fetchEmix(emoji1, emoji2);

        if (!imageUrl) {
            return reply(
                "❌ Could not generate emoji mix. Try different emojis.",
                { contextInfo: setContext(sender), quoted: mek }
            );
        }

        let buffer = await getBuffer(imageUrl);
        let sticker = new Sticker(buffer, {
            pack: "Emoji Mix",
            author: "MASKY MD",
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            quality: 75,
            background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(mek.chat, 
            { sticker: stickerBuffer }, 
            { quoted: mek, contextInfo: setContext(sender) }
        );

    } catch (e) {
        console.error("Error in .emix command:", e.message);
        reply(
            `❌ Could not generate emoji mix: ${e.message}`,
            { contextInfo: setContext(m.sender), quoted: mek }
        );
    }
});