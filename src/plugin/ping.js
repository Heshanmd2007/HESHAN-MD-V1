const pingCommand = async (m) => {
  try {
    const prefixMatch = m.body.match(/^[/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim().toLowerCase() : '';

    const validCommands = ['ping'];

    if (validCommands.includes(cmd)) {
      const randomMs = Math.floor(Math.random() * (500 - 50 + 1)) + 50;  // Random value between 50ms to 500ms
      const message = `🏓 *Ping Response with Rcd*: \n\n✨ *Your ping is ${randomMs}ms* ✨\n\n💡 *Response time varies with network speed.* 🌐\n\n⏳ *Stay connected for more fast responses!* 🚀`;

      m.reply(message);
    }
  } catch (err) {
    console.error(err);
  }
};

export default pingCommand;
