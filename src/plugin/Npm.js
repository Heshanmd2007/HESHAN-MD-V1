import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const npmSearch = async (m, bot) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'npm') {
    const packageName = m.body.split(' ').slice(1).join(' ');
    if (!packageName) {
      return m.reply(`*Please provide a package name to search*\n\nExample: ${prefix}npm yt-search`);
    }

    const apiUrl = `https://api.giftedtech.my.id/api/search/npmsearch?apikey=gifted&packagename=${encodeURIComponent(packageName)}`;

    try {
      m.reply('🚀 *Searching for NPM package...* Please wait...');
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.success || data.status !== 200) {
        return m.reply(`❌ Package not found: *${packageName}*. Please try another package.`);
      }

      const result = data.result;
      const {
        name,
        description,
        version,
        packageLink,
        downloadLink,
        publishedDate,
        owner,
      } = result;

      // Message with package details
      const caption = `*🔍 NPM Package Found:*\n\n` +
        `*📦 Name:* ${name}\n` +
        `*📝 Description:* ${description}\n` +
        `*🔢 Version:* ${version}\n` +
        `*📅 Published:* ${publishedDate}\n` +
        `*👤 Owner:* ${owner}\n\n` +
        `*🔗 Package Link:* [View on NPM](${packageLink})\n` +
        `*📥 Downloading package... Please wait.*`;

      // Sending package details
      await bot.sendMessage(m.from, {
        image: { url: 'https://telegra.ph/file/2d9a21c403a79096b88c1.jpg' },
        caption,
      }, { quoted: m });

      // Download the package
      const responseDownload = await fetch(downloadLink);
      const fileName = `${name}-${version}.tgz`;
      const filePath = path.join(__dirname, fileName);

      const fileStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        responseDownload.body.pipe(fileStream);
        responseDownload.body.on('error', reject);
        fileStream.on('finish', resolve);
      });

      // Send downloaded package to the user
      await bot.sendMessage(m.from, {
        document: { url: `file://${filePath}` },
        mimetype: 'application/gzip',
        fileName,
        caption: `✅ *Download Complete!*\n\n*📦 Package Name:* ${name}\n*🔢 Version:* ${version}\n*📅 Published:* ${publishedDate}`,
      }, { quoted: m });

      // Remove the downloaded file after sending
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error fetching or downloading NPM package:', error);
    }
  }
};

export default npmSearch;
