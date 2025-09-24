const { cmd } = require('../command');
const config = require('../config');
const getRandomMenuImage = require('../menuImages'); // import random menu image

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
    pattern: "developer",
    alias: ["creator", "coder", "dev"],
    desc: "Show bot creator information",
    category: "info",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Owner information (you can modify these values)
        const ownerInfo = {
            name: "*𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐦𝐚𝐬𝐤𝐲 𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐭𝐞𝐜𝐡*",
            number: "+2348074548225",
            bio: "The creator of this amazing bot"
        };

        // Beautiful formatted message
        const creatorMessage = `
╭─===「 > *CREATOR INFO* < 」====
]>
│ *🪪 Name:* ${ownerInfo.name}
│ *📞 Number:* ${ownerInfo.number}
│ *📝 Bio:* ${ownerInfo.bio}
│
│ *🤖 Bot Name:* ${config.BOT_NAME}
│ *⚡ Version:* ${config.VERSION || "4.0.0"}
]>
╰=================================

💡 *Contact for bot queries or support*`;

        // Send message with random menu image
        await conn.sendMessage(from, {
            image: { url: getRandomMenuImage() },
            caption: creatorMessage,
            contextInfo: setContext(sender)
        }, { quoted: mek });

    } catch (e) {
        console.error("Creator Command Error:", e);
        // Fallback text if image fails, with context info & random menu image
        await reply(
            `👑 *Creator Info*\n\nName: MASKY-MD\nNumber: +2348074548225\n\nContact for bot support!`,
            { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() }
        );
    }
});