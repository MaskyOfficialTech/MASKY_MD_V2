const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 📌 Default contextInfo
const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    mentionedJid: [],
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363423221401585@newsletter",
        newsletterName: "MASKY MD",
        serverMessageId: 143
    }
};

// 📌 Helper reply with contextInfo
async function sendReply(conn, to, text, quoted) {
    return conn.sendMessage(to, { text, contextInfo }, { quoted });
}

cmd({
    pattern: "nobg",
    alias: ["cutbg", "rbg"],
    react: "🖼️",
    desc: "Remove background from an image (using remove.bg)",
    category: "tools",
    use: ".removebg (reply to image)",
    filename: __filename
}, async (conn, mek, m, { from, q, isCreator }) => {
    try {
        if (!isCreator) 
            return sendReply(conn, from, "❌ Owner only command", m);

        if (!m.quoted || m.quoted.mtype !== "imageMessage")
            return sendReply(conn, from, "⚠️ Please reply to an image", m);

        // Your RemoveBG API key
        const apiKey = "TQLq6Pd4Pa6VGQTZEHdobVh2"; 
        if (!apiKey) return sendReply(conn, from, "❌ Missing remove.bg API key", m);

        const buffer = await m.quoted.download();
        const tempPath = path.join(__dirname, "temp_img.png");
        fs.writeFileSync(tempPath, buffer);

        // Call remove.bg API
        const { data } = await axios({
            method: "POST",
            url: "https://api.remove.bg/v1.0/removebg",
            data: fs.createReadStream(tempPath),
            headers: {
                "X-Api-Key": apiKey
            },
            responseType: "arraybuffer"
        });

        const outputPath = path.join(__dirname, "removed.png");
        fs.writeFileSync(outputPath, data);

        await conn.sendMessage(from, {
            image: fs.readFileSync(outputPath),
            caption: "✅ Background removed successfully",
            contextInfo
        }, { quoted: m });

        fs.unlinkSync(tempPath);
        fs.unlinkSync(outputPath);

    } catch (e) {
        console.error(e);
        sendReply(conn, from, `❎ Error: ${e.message || "Failed to remove background"}`, m);
    }
});