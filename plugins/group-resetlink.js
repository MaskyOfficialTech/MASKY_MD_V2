const config = require('../config')
const { cmd } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
    desc: "To Reset the group link",
    category: "group",
    use: '.revoke',
    filename: __filename
},
async (conn, mek, m, {
    from, isCmd, isGroup, sender, isBotAdmins,
    isAdmins, reply
}) => {
    try {
        if (!isGroup) return reply(`❌ This command only works in groups.`);
        if (!isAdmins) return reply(`⛔ You must be a *Group Admin* to use this command.`);
        if (!isBotAdmins) return reply(`❌ I need to be *admin* to reset the group link.`);

        await conn.groupRevokeInvite(from);

        // Add contextInfo to mention the sender in the confirmation message
        const contextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363423221401585@newsletter',
                newsletterName: 'MASKY MD',
                serverMessageId: 143
            }
        };

        await conn.sendMessage(from, {
            text: `✅ *Group Link has been reset successfully!* \n\nTriggered by: @${sender.split('@')[0]}`,
            contextInfo
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply(`❌ Error resetting group link.`);
    }
});