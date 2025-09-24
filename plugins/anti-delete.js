const { cmd } = require('../command');
const { getAnti, setAnti } = require('../data/antidel');


cmd({
    pattern: "antidelete",
    alias: ['antidel', 'del'],
    desc: "Toggle anti-delete feature",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, text, isCreator }) => {

    // define contextInfo once
    const contextInfo = {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363423221401585@newsletter',
            newsletterName: MASKY MD,
            serverMessageId: 143
        }
    };

    // helper function for sending replies with contextInfo
    const sendReply = (msg) => conn.sendMessage(from, { text: msg, contextInfo }, { quoted: m });

    if (!isCreator) return sendReply('This command is only for the bot owner');

    try {
        const currentStatus = await getAnti();

        if (!text || text.toLowerCase() === 'status') {
            return sendReply(`*AntiDelete Status:* ${currentStatus ? '✅ ON' : '❌ OFF'}\n\nUsage:\n• .antidelete on - Enable\n• .antidelete off - Disable`);
        }

        const action = text.toLowerCase().trim();

        if (action === 'on') {
            await setAnti(true);
            return sendReply('✅ Anti-delete has been enabled');
        } 
        else if (action === 'off') {
            await setAnti(false);
            return sendReply('❌ Anti-delete has been disabled');
        } 
        else {
            return sendReply('Invalid command. Usage:\n• .antidelete on\n• .antidelete off\n• .antidelete status');
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return sendReply("An error occurred while processing your request.");
    }
});