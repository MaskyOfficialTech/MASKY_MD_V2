const config = require('../config');
const { cmd, commands } = require('../command');

// Array of different fancy text styles for MASKY-MD
const botNameStyles = [
"𝗠𝗮𝘀𝗸𝘆 𝗠𝗗", // Bold
"𝘔𝘢𝘴𝘬𝘺 𝘔𝘋", // Italic
"𝙼𝚊𝚜𝚔𝚢 𝙼𝙳", // Monospace
"𝓜𝓪𝓼𝓴𝔂 𝓜𝓓", // Cursive / Script
"𝔐𝔞𝔰𝔨𝔶 𝔐𝔇", // Fraktur
"🅼🅰🆂🅺🆈 🅼🅳", // Squared
"ⓂⒶⓈⓀⓎ ⓂⒹ", // Circled
"ᴹᵃˢᵏʸ ᴹᴰ", // Small caps
"Ｍａｓｋｙ ＭＤ", // Fullwidth
"ᎷᎪᏚᏦᎩ ᎷᎠ", // Fancy Unicode
"𝙈𝙖𝙨𝙠𝙮 𝙈𝘿", // Handwriting style
"🄼🄰🅂🄺🅈 🄼🄳", // Bold squared
"𝓜𝓪𝓼𝓴𝔂 𝓜𝓓", // Elegant script
"ᴹᵃˢᵏʸ ᴹᴰ", // Small caps again
"🅼🅰🆂🅺🆈 🅼🅳", // Modern bold squared
"𝔐𝔞𝔰𝔨𝔶 𝔐𝔇", // Fraktur
"𝙼𝚊𝚜𝚔𝚢 𝙼𝙳", // Monospace bold
"𝑀𝑎𝑠𝑘𝑦 𝑀𝐷", // Elegant math bold
"𝓜𝓪𝓼𝓴𝔂 𝓜𝓓", // Handwriting cursive
"🄼🄰🅂🄺🅈 🄼🄳", // Bold squared alternative
"ᴹᵃˢᵏʸ ᴹᴰ", // Small caps variation
"Ｍａｓｋ𝓎 ＭＤ", // Mixed fullwidth & script
"𝔐𝓪𝓼𝓴𝔂 𝓜𝔇", // Mixed fraktur + script
"🅼🄰🆂🄺🆈 🅼🄳", // Squared alternative
"ⓂⒶⓈⓀⓎ ⓂⒹ", // Circled variation
"𝓜𝓪𝓼𝓴𝔂 𝓜𝓓"
];

// Track current style index
let currentStyleIndex = 0;

cmd({
    pattern: "ping",
    alias: ["speed","pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "🌡️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        // Get current fancy bot name and rotate for next time
        const fancyBotName = botNameStyles[currentStyleIndex];
        currentStyleIndex = (currentStyleIndex + 1) % botNameStyles.length;

        const text = `> *${fancyBotName} SPEED: ${responseTime.toFixed(2)}ms ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423221401585@newsletter',
                    newsletterName: "MASKY-MD",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

// ping2 remains unchanged
cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍂",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*PINGING...*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `*🔥 MASKY-MD https://whatsapp.com/channel/0029VbBOLGnBPzjadFglXS3R SPEED : ${ping}ms*` }, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
