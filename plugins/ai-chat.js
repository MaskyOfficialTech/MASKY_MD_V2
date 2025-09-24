const { cmd } = require('../command');
const axios = require('axios');
const getRandomMenuImage = require('../menuImages'); // import random menu image
const config = require('../config'); // assuming you have your config file

// single contextInfo to reuse everywhere
const contextInfo = {
  mentionedJid: [], // will set dynamically per message
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363423221401585@newsletter',
    newsletterName: config.OWNER_NAME,
    serverMessageId: 143
  }
};

function setContext(sender) {
  contextInfo.mentionedJid = [sender];
  return contextInfo;
}

// AI command: .ai
cmd({
  pattern: "ai",
  alias: ["bot", "masky", "gpt", "gpt4", "bing"],
  desc: "Chat with an AI model",
  category: "ai",
  react: "🤖",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply, react }) => {
  try {
    if (!q) return reply("Please provide a message for the AI.\nExample: `.ai Hello`", { contextInfo: setContext(m.sender), quoted: m });

    const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.message) {
      await react("❌");
      return reply("AI failed to respond. Please try again later.", { contextInfo: setContext(m.sender), quoted: m });
    }

    await reply(`🤖 *AI Response:*\n\n${data.message}`, { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
    await react("✅");
  } catch (e) {
    console.error("Error in AI command:", e);
    await react("❌");
    reply("An error occurred while communicating with the AI.", { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
  }
});

// OpenAI command: .openai
cmd({
  pattern: "openai",
  alias: ["chatgpt", "gpt3", "open-gpt"],
  desc: "Chat with OpenAI",
  category: "ai",
  react: "🧠",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply, react }) => {
  try {
    if (!q) return reply("Please provide a message for OpenAI.\nExample: `.openai Hello`", { contextInfo: setContext(m.sender), quoted: m });

    const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.result) {
      await react("❌");
      return reply("OpenAI failed to respond. Please try again later.", { contextInfo: setContext(m.sender), quoted: m });
    }

    await reply(`🧠 *OpenAI Response:*\n\n${data.result}`, { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
    await react("✅");
  } catch (e) {
    console.error("Error in OpenAI command:", e);
    await react("❌");
    reply("An error occurred while communicating with OpenAI.", { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
  }
});

// DeepSeek AI command: .deepseek
cmd({
  pattern: "deepseek",
  alias: ["deep", "seekai"],
  desc: "Chat with DeepSeek AI",
  category: "ai",
  react: "🧠",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply, react }) => {
  try {
    if (!q) return reply("Please provide a message for DeepSeek AI.\nExample: `.deepseek Hello`", { contextInfo: setContext(m.sender), quoted: m });

    const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.answer) {
      await react("❌");
      return reply("DeepSeek AI failed to respond. Please try again later.", { contextInfo: setContext(m.sender), quoted: m });
    }

    await reply(`🧠 *DeepSeek AI Response:*\n\n${data.answer}`, { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
    await react("✅");
  } catch (e) {
    console.error("Error in DeepSeek AI command:", e);
    await react("❌");
    reply("An error occurred while communicating with DeepSeek AI.", { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
  }
});