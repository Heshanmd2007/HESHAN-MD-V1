
const config = require('../config')
const {cmd , commands} = require('../command')
cmd({

    pattern: "menu",

    react: "🍁",

    alias: ["allmenu","bot","commands"],

    desc: "Get bot\'s command list.",

    category: "main",

    use: '.menu3',

    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, umarmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{
let madeMenu = `*╭━━❍〘〘 ${config.BOT_NAME} 〙〙*
*┃🪾 ᴍᴏᴅᴇ* : *${config.MODE}*
*┃🪄 ᴘʀᴇғɪx* : *${config.PREFIX}*
*┃🌀 ʙᴀɪʟᴇʏs: ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ*
*┃🎐 ʀᴀᴍ* : *34.56 ɢʙ/60.79*
*┃👑 ᴄʀᴇᴀᴛᴏʀ* : *ʜᴇꜱʜᴀɴ*
*┃⏰ ᴀʟᴡᴀʏs ᴏɴʟɪɴᴇ* : *${config.ALWAYS_ONLINE}*
*┃🫟 ᴠᴇʀsɪᴏɴs* : *ᴠ.0.0.1*
*╰━━━━━━━━━━━━━━━━━━❍*
*♡︎•━━━━━━━━☻︎━━━━━━━━•♡︎*
*╭─❍ 📥DOWNLOAD-CMD📥 ❍* 
*├⬡ .ғʙ*
*├⬡ .ᴠɪᴅᴇᴏ*
*├⬡ .sᴏɴɢ*
*├⬡ .ᴛɪᴋᴛᴏᴋ*
*┕──────────────────❍*
*╭──❍ 🔎 SEARCH-CMD 🔍 ❍* 
*├⬡ .ꜱʀᴇᴘᴏ*
*┕──────────────────❍*
*╭──❍ 👨‍💻 USER-CMD 👨‍💻 ❍* 
*├⬡ .ᴏᴡɴᴇʀ*
*├⬡ .ᴘɪɴɢ*
*├⬡ .ꜱʏꜱᴛᴇᴍ*
*├⬡ .ᴀʟɪᴠᴇ*
*┕──────────────────❍*
> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © ʀᴀᴠɪɴᴅᴜ_𝙼𝙳*`

await conn.sendMessage(from,{image:{url: config.ALIVE_IMG},caption:madeMenu,
                             contextInfo: {
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '',
      newsletterName: '𝗥𝗔𝗩𝗜𝗡𝗗𝗨 𝗠𝗗 𝗩1 🤖',
      serverMessageId: 999
    }
  }
}, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
