const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
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
      return; // no reply if not owner
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*",
        contextInfo
      }, { quoted: message });
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
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported",
          contextInfo
        }, { quoted: message });
    }

    // Forward to user's DM (with contextInfo too)
    await client.sendMessage(message.sender, messageContent, options);

  } catch (error) {
    console.error("vv2 Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message,
      contextInfo
    }, { quoted: message });
  }
});