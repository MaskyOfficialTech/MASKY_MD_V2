const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require("os");
const path = require('path');
const axios = require('axios');
const fs = require('fs');

cmd({
    pattern: "env",
    desc: "menu the bot",
    category: "menu3",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const dec = `╭━━━〔 *${config.BOT_NAME} Main Menu* 〕━━━╮
┃ ✨ *Owner:* ${config.OWNER_NAME}
┃ ⚙️ *Mode:* ${config.MODE}
┃ 📡 *Platform:* Heroku
┃ 🧠 *Type:* NodeJs (Multi Device)
┃ ⌨️ *Prefix:* ${config.PREFIX}
┃ 🧾 *Version:* 3.0.0 Beta
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 *Menu* 〕━━┈⊷
‎┃◈╭─────────────·๏
‎┃◈┃• *admin-events*
‎┃◈┃• *welcome*
‎┃◈┃• *setprefix*
‎┃◈┃• *mode*
‎┃◈┃• *auto_typing*
‎┃◈┃• *always_online*
‎┃◈┃• *auto_reacording*
‎┃◈┃• *status_view* 
‎┃◈┃• *status_react*
‎┃◈┃• *read_message*
‎┃◈┃• *auto_sticker*
‎┃◈┃• *anti_bad*
‎┃◈┃• *auto_reply*
‎┃◈┃• *auto_voice*
‎┃◈┃• *custom_reacts*
‎┃◈┃• *auto_react*
‎┃◈┃• *anti_link* 
‎┃◈┃• *status_reply*
‎┃◈└───────────┈⊷
‎╰──────────────┈⊷
> ${config.DESCRIPTION}
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363423221401585@newsletter',
                        newsletterName: 'MASKY MD',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // generate random audio url 
const menuAudios = [ "https://files.catbox.moe/nbe0f1.mp3", "https://files.catbox.moe/r3cs9v.mp3", "https://files.catbox.moe/ixz863.mp3", "https://files.catbox.moe/xajkko.mp3", "https://files.catbox.moe/thiyq2.mp3", "https://files.catbox.moe/3c8rg0.mp3", "https://files.catbox.moe/hdu77w.mp3", "https://files.catbox.moe/jst6zv.mp3", "https://files.catbox.moe/uyekb6.mp3" ];




// Pick a random audio URL
const randomAudio = menuAudios[Math.floor(Math.random() * menuAudios.length)];

await conn.sendMessage(from, {
    audio: { url: randomAudio },
    mimetype: 'audio/mp4',
    ptt: true
}, { quoted: mek });


    } catch (e) {
        console.error(e);
        reply(`❌ Error:\n${e}`);
    }
});
