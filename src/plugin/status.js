import fs from 'fs';
import config from '../../config.cjs';

const handleGreeting = async (m, gss) => {
  try {
    const textLower = m.body.toLowerCase();

    // Combine trigger words from config and additional ones
    const triggerWords = [
      ...config.triggerWords,
      'send', 'oni', 'one', 'ewnna', 'දපන්', 'දහන්', 'upload',
      'send me', 'sent me', 'znt', 'snt', 'ayak', 'do', 'mee'
    ];

    if (triggerWords.includes(textLower)) {
      if (m.message && m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
        const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;

        if (quotedMessage) {
          // Check if it's an image
          if (quotedMessage.imageMessage) {
            const imageCaption = quotedMessage.imageMessage.caption;
            const imageUrl = await gss.downloadAndSaveMediaMessage(quotedMessage.imageMessage);

            // Send the image message
            await gss.sendMessage(m.from, {
              image: { url: imageUrl },
              caption: imageCaption,
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              },
            });

            // Send an additional message
            await gss.sendMessage(m.from, { text: "*ʜᴇꜱʜᴀɴ ᴍᴅ ꜱᴛᴀᴛᴜꜱ ꜰᴏʀᴡᴀʀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ* 📍" });
          }

          // Check if it's a video
          if (quotedMessage.videoMessage) {
            const videoCaption = quotedMessage.videoMessage.caption;
            const videoUrl = await gss.downloadAndSaveMediaMessage(quotedMessage.videoMessage);

            // Send the video message
            await gss.sendMessage(m.from, {
              video: { url: videoUrl },
              caption: videoCaption,
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              },
            });

            // Send an additional message
            await gss.sendMessage(m.from, { text: "*ʜᴇꜱʜᴀɴ ᴍᴅ ꜱᴛᴀᴛᴜꜱ ꜰᴏʀᴡᴀʀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ*📍" });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default handleGreeting;
