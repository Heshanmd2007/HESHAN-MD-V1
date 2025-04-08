import fetch from 'node-fetch';

const img = async (m, bot) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'img' || cmd === 'image') {
    const query = m.body.split(' ').slice(1).join(' ');
    if (!query) {
      return m.reply(`*Please provide a search query for the image*\n\nExample: ${prefix}img cat`);
    }

    const apiUrl = `https://api.giftedtech.my.id/api/search/googleimage?apikey=gifted&query=${encodeURIComponent(query)}`;

    try {
      m.reply('🚀 *Searching for images...* Please wait...');
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.success || data.status !== 200) {
        throw new Error('Failed to fetch images.');
      }

      const images = data.result.slice(0, 10); // Get the first 10 images
      if (images.length === 0) {
        return m.reply('❌ No images found for your query.');
      }

      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i].url;
        await bot.sendMessage(m.from, {
          image: { url: imageUrl },
          caption: `*🔍 Here is your image result for:* ${query} \n*Image ${i + 1} of 10*`,
          contextInfo: {
            quotedMessage: m.message,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363286758767913@newsletter',
              newsletterName: 'RCD-MD FORWARD',
              serverMessageId: 143 + i, // Increment server message ID for each image
            },
          },
        }, { quoted: m });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      m.reply('❌ Error fetching images.');
    }
  }
};

export default img;
