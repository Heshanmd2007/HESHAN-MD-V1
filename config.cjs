// config.js
const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "Your Session Id",
  PREFIX: process.env.PREFIX || '.',
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === 'true' : true,
  AUTO_STATUS_READ: process.env.AUTO_STATUS_READ !== undefined ? process.env.AUTO_STATUS_READ === 'true' : true, 
  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY !== undefined ? process.env.AUTO_STATUS_REPLY === 'false' : false,
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || '*𝗦𝗧𝗔𝗧𝗨𝗦 𝗦𝗘𝗘𝗡 𝗕𝗬 𝗛𝗘𝗦𝗛𝗔𝗡 𝗠𝗗 📍*',
  AUTO_DL: process.env.AUTO_DL !== undefined ? process.env.AUTO_DL === 'true' : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === 'false' : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === 'false' : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === 'false' : false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === 'false' : false,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === 'false' : false,
   /*auto block only for 212 */
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === 'false' : false,
  
  triggerWords: [
    "send", "oni", "one", "dapan", "dpn", "දහන්", "upload",
    "send me", "sent me", "znt", "snt", "ayak", "do", "mee", "autoread", "Ewapan", "ewanna"
  ],
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === 'true' : false, 
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === 'true' : true,
  MODE: process.env.MODE || "privet",
  OWNER_NAME: process.env.OWNER_NAME || "HESHAN MD",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "94719845166",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === 'true' : true, 
};

module.exports = config;
