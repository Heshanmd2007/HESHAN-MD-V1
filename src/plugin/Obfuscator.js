import obfuscator from 'javascript-obfuscator';

const obfuscateJS = async (m, bot) => {
  try {
    // Match the prefix from the message body
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix)
      ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
      : '';

    if (cmd === 'obfuscate') {
      const code = m.body.split(' ').slice(1).join(' ');

      if (!code) {
        return m.reply(
          `*Please provide JavaScript code to obfuscate*\n\n*Example:*\n${prefix}obfuscate console.log("Hello, World!");`
        );
      }

      // Obfuscate the JavaScript code
      const obfuscatedCode = obfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
      }).getObfuscatedCode();

      // Reply with the obfuscated code
      const response = `*✅ Obfuscated JavaScript Code:*\n\n\`\`\`${obfuscatedCode}\`\`\``;
      await bot.sendMessage(m.from, { text: response }, { quoted: m });
    }
  } catch (error) {
    console.error('Error during obfuscation:', error);
    m.reply('❌ Error during obfuscation. Please ensure your input is valid JavaScript code.');
  }
};

export default obfuscateJS;
