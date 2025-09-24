const { cmd } = require('../command');
const config = require('../config'); // assuming your contextInfo is tied to config

cmd({
    pattern: "jid",
    alias: ["id", "chatid", "gjid"],  
    desc: "Get full JID of current chat/user (Creator Only)",
    react: "🆔",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, isGroup, isCreator, reply, sender 
}) => {
    try {
        if (!isCreator) {
            return reply(
                "❌ *Command Restricted* - Only my creator can use this.",
                { contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363423221401585@newsletter',
                        newsletterName: config.OWNER_NAME,
                        serverMessageId: 143
                    }
                }, quoted: mek }
            );
        }

        if (isGroup) {
            const groupJID = from.includes('@g.us') ? from : `${from}@g.us`;
            return reply(`👥 *Group JID:*\n\`\`\`${groupJID}\`\`\``);
        } else {
            const userJID = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
            return reply(`👤 *User JID:*\n\`\`\`${userJID}\`\`\``);
        }

    } catch (e) {
        console.error("JID Error:", e);
        reply(
            `⚠️ Error fetching JID:\n${e.message}`,
            { contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423221401585@newsletter',
                    newsletterName: config.OWNER_NAME,
                    serverMessageId: 143
                }
            }, quoted: mek }
        );
    }
});