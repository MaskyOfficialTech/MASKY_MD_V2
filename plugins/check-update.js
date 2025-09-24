const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const getRandomMenuImage = require('../menuImages'); // import random menu image
const config = require('../config'); // import your config

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
  pattern: 'version',
  alias: ["changelog", "cupdate", "checkupdate"],
  react: '🚀',
  desc: "Check bot's version, system stats, and update info.",
  category: 'info',
  filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
  try {
    // Read local version data
    const localVersionPath = path.join(__dirname, '../data/version.json');
    let localVersion = 'Unknown';
    let changelog = 'No changelog available.';
    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    // Fetch latest version data from GitHub
    const rawVersionUrl = 'https://raw.githubusercontent.com/MaskyOfficialTech/MASKY_MD_V2/main/data/version.json';
    let latestVersion = 'Unknown';
    let latestChangelog = 'No changelog available.';
    try {
      const { data } = await axios.get(rawVersionUrl);
      latestVersion = data.version;
      latestChangelog = data.changelog;
    } catch (error) {
      console.error('Failed to fetch latest version:', error);
    }

    // Count total plugins
    const pluginPath = path.join(__dirname, '../plugins');
    const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;

    // Count total registered commands
    const totalCommands = commands.length;

    // System info
    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    const lastUpdate = fs.existsSync(localVersionPath) ? fs.statSync(localVersionPath).mtime.toLocaleString() : 'Unknown';

    // GitHub stats
    const githubRepo = 'https://github.com/MaskyOfficialTech/MASKY_MD_V2';

    // Check update status
    let updateMessage = `✅ Your  MASKY MD bot is up-to-date!`;
    if (localVersion !== latestVersion) {
      updateMessage = `🚀 Your MASKY-MD bot is outdated!
🔹 *Current Version:* ${localVersion}
🔹 *Latest Version:* ${latestVersion}

Use *.update* to update.`;
    }

    const statusMessage = `🌟 *Good ${new Date().getHours() < 12 ? 'Morning' : 'Night'}, ${pushname}!* 🌟\n\n` +
      `📌 *Bot Name:* MASKY-MD\n🔖 *Current Version:* ${localVersion}\n📢 *Latest Version:* ${latestVersion}\n📂 *Total Plugins:* ${pluginCount}\n🔢 *Total Commands:* ${totalCommands}\n\n` +
      `💾 *System Info:*\n⏳ *Uptime:* ${uptime}\n📟 *RAM Usage:* ${ramUsage}MB / ${totalRam}MB\n⚙️ *Host Name:* ${hostName}\n📅 *Last Update:* ${lastUpdate}\n\n` +
      `📝 *Changelog:*\n${latestChangelog}\n\n` +
      `⭐ *GitHub Repo:* ${githubRepo}\n👤 *Owner:* [MASKY-MD](https://github.com/MaskyOfficialTech)\n\n${updateMessage}\n\n🚀 *Hey! Don't forget to fork & star the repo!*`;

    // Send the status message with a random menu image and contextInfo
    await conn.sendMessage(from, {
      image: { url: getRandomMenuImage() },
      caption: statusMessage,
      contextInfo: setContext(sender)
    }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching version info:', error);
    reply('❌ An error occurred while checking the bot version.', { contextInfo: setContext(m.sender), quoted: m, image: getRandomMenuImage() });
  }
});