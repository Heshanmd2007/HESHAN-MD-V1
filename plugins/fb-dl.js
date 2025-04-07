const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fbdl",
  alias: ["facebook", "fb"],
  react: '⏰',
  desc: "Download videos from Facebook.",
  category: "download",
  use: ".fbdl <Facebook video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a Facebook video URL
    const fbUrl = args[0];
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply('*Please Provide A҇Fb Video Or Reel Url..*');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(fbUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.video) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    // Extract the video details
    const { title, thumbnail, downloads } = response.data.video;

    // Get the highest quality download link (HD or SD)
    const downloadLink = downloads.find(d => d.quality === "HD")?.downloadUrl || downloads[0].downloadUrl;

    // Inform the user that the video is being downloaded
   // await reply('```Downloading video... Please wait.📥```');

    // Download the video
    const videoResponse = await axios.get(downloadLink, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send the video with details
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `*HESHAN_𝐌𝐃 𝐅𝐁 𝐃𝐋*\n\n` +
        `🔖 *TITLE*: ${title}\n` +
        `📏 *QUALITY*: ${downloads.find(d => d.quality === "HD") ? "HD" : "SD"}\n\n` +
        `> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ʜᴇꜱʜᴀɴ_𝙼𝙳*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '',
          newsletterName: '『 𝗛𝗘𝗦𝗛𝗔𝗡 𝐌𝐃 🤖 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

        
