import fetch from 'node-fetch';

const pinterestdl = async (m, bot) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'pinterestdl') {
    const urlMatch = m.body.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      return m.reply(`*Please provide a valid Pinterest URL*\n\n\n\nExample: ${prefix}pinterestdl <url>`);
    }

    const pinterestUrl = urlMatch[0];
    const apiUrl = `https://api.giftedtech.my.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`;

    try {
      m.reply('🚀 *Loading  data...* Please wait...');
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.success || data.status !== 200) {
        throw new Error('Failed to fetch data.');
      }

      const { title, media } = data.result;

      for (const item of media) {
        const message = item.format === 'JPG' 
          ? { image: { url: item.download_url }, caption: `*🎨 Title:* ${title}\n\n*📂 Type:* ${item.type}\n\n*📄 Format:* ${item.format}` }
          : { video: { url: item.download_url }, caption: `*🎨 Title:* ${title}\n\n*📂 Type:* ${item.type}\n\n*📄 Format:* ${item.format}` };

        await bot.sendMessage(m.from, message, { quoted: m });
      }
    } catch (error) {
      console.error('Error fetching Pinterest media:', error);
      m.reply('*❌ Error data Pinterest media try again*');
    }
  }
};

export default pinterestdl;
