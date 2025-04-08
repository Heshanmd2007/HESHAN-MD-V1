const kickAll = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    // Check for the valid command
    const validCommands = ['kick-all', 'delete-group'];
    if (!validCommands.includes(cmd)) return;

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

    // Message to be sent to kicked members
    const privateMessage = "ඔබ මෙම කණ්ඩායමෙන් ඉවත් කරන ලදි. අපෙන් සමාවන්න!";

    for (let participant of participants) {
      if (participant.id !== botNumber) { // Avoid kicking the bot
        try {
          // Send private message
          await gss.sendMessage(participant.id, { text: privateMessage });

          // Kick the participant
          await gss.groupParticipantsUpdate(m.from, [participant.id], 'remove');
        } catch (error) {
          console.error(`Failed to kick: ${participant.id}`, error);
        }
      }
    }

    await m.reply("*✅ All members have been kicked successfully!*");
  } catch (error) {
    console.error('Error:', error);
    await m.reply('An error occurred while processing the command.');
  }
};

export default kickAll;
