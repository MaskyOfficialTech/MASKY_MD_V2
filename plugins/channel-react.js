const { cmd } = require("../command");

// 🔤 Stylized Characters
const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

// 📌 Default contextInfo
const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    mentionedJid: [],
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363423221401585@newsletter',
        newsletterName: 'MASKY MD',
        serverMessageId: 143
    }
};

// 📌 Helper to reply with contextInfo
async function sendReply(conn, to, text, quoted) {
    return conn.sendMessage(to, { text, contextInfo }, { quoted });
}

cmd({
    pattern: "chreact",
    alias: ["channelreact"],
    react: "🔤",
    desc: "React to channel messages with stylized text",
    category: "owner",
    use: '.chr <channel-link> <text>',
    filename: __filename
},
async (conn, mek, m, {
    from, q, command, sender, isCreator, reply
}) => {
    try {
        if (!isCreator) return sendReply(conn, from, "❌ Owner only command", m);
        if (!q) return sendReply(conn, from, `Usage:\n${command} https://whatsapp.com/channel/1234567890 hello`, m);

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/"))
            return sendReply(conn, from, "⚠️ Invalid channel link format", m);
        
        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) return sendReply(conn, from, "⚠️ Please provide text to convert", m);

        const emoji = inputText
            .split('')
            .map(char => (char === ' ' ? '―' : stylizedChars[char] || char))
            .join('');

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        if (!channelId || !messageId) 
            return sendReply(conn, from, "⚠️ Invalid link - missing IDs", m);

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

        return sendReply(conn, from,
`╭━━━〔 *MASKY-MD* 〕━━━┈⊷
┃▸ *✅ Success!* Reaction sent
┃▸ *Channel:* ${channelMeta.name}
┃▸ *Reaction:* ${emoji}
╰────────────────┈⊷
> *MASKY_MD*`, m);

    } catch (e) {
        console.error(e);
        sendReply(conn, from, `❎ Error: ${e.message || "Failed to send reaction"}`, m);
    }
});