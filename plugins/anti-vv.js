const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "vv",
  alias: ["viewonce", 'retrive'],
  react: '🐳',
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // contextInfo setup
    const contextInfo = {
      mentionedJid: [message.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363423221401585@newsletter',
        newsletterName: config.OWNER_NAME,
        serverMessageId: 143
      }
    };

    const sendReply = (msg) => client.sendMessage(from, { text: msg, contextInfo }, { quoted: message });

    if (!isCreator) {
      return sendReply("*📛 This is an owner command.*");
    }

    if (!match.quoted) {
      return sendReply("*🍁 Please reply to a view once message!*");
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg",
          contextInfo
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4",
          contextInfo
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false,
          contextInfo
        };
        break;
      default:
        return sendReply("❌ Only image, video, and audio messages are supported");
    }

    // send back retrieved content with contextInfo
    await client.sendMessage(from, messageContent, options);

  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message,
      contextInfo
    }, { quoted: message });
  }
});