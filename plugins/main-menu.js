const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const axios = require('axios');

const smallCaps = {
  "A": "ᴀ", "B": "ʙ", "C": "ᴄ", "D": "ᴅ", "E": "ᴇ", "F": "ꜰ", "G": "ɢ",
  "H": "ʜ", "I": "ɪ", "J": "ᴊ", "K": "ᴋ", "L": "ʟ", "M": "ᴍ", "N": "ɴ",
  "O": "ᴏ", "P": "ᴘ", "Q": "ǫ", "R": "ʀ", "S": "s", "T": "ᴛ", "U": "ᴜ",
  "V": "ᴠ", "W": "ᴡ", "X": "x", "Y": "ʏ", "Z": "ᴢ"
};

const toSmallCaps = (text) => {
  return text.split('').map(char => smallCaps[char.toUpperCase()] || char).join('');
};

cmd({
  pattern: "menu",
  alias: ["allmenu", "mini"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "💫",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");
    const time = moment().tz("America/Port-au-Prince").format("HH:mm:ss");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    const sender = m.sender || "user@unknown";
    const username = sender.split("@")[0];

    let menuText = `んﾉ 👋 @${username} w乇ﾚcom乇 ｲo  ɢᴀᴀʀᴀ xᴍᴅ

> ┏━━⬣ ⌜ ɢᴀᴀʀᴀ xᴍᴅ ⌟
> ┃ 👨‍💻 ᴅᴇᴠ : ɢᴀᴀʀᴀ
> ┃ 🧰 ᴍᴏᴅᴇ : ${config.MODE}
> ┃ 👤 ᴜsᴇʀ : @${username}
> ┃ ⌛️ ʀᴜɴᴛɪᴍᴇ : ${uptime()}
> ┃ 🗝 ᴘʀᴇғɪx : [${config.PREFIX}]
> ┃ 🛠️ ᴠᴇʀsɪᴏɴ : 1.0.0
> ┃ 🛠️ *ᴩʟᴜɢɪɴ* : ${totalCommands}
> ┗━━━━━━━━━━━━━━━━━━━━⬣

> ━━━━━━━ ɢᴀᴀʀᴀ xᴍᴅ ᴍᴇɴᴜ ━━━━━━━━
`;

    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();
    for (let k of keys) {
  menuText += `\n\n> ╭──❖ *${k.toUpperCase()}*\n`;
  const cmds = category[k]
    .filter(c => typeof c.pattern === 'string')
    .sort((a, b) => a.pattern.localeCompare(b.pattern));
  
  cmds.forEach((cmd) => {
    const usage = cmd.pattern.split('|')[0];
    menuText += `> │ ◦ ${config.PREFIX}${toSmallCaps(usage)}\n`;
  });
  
  menuText += `> ╰──────────────❖`;
}


    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/fjepmq.jpg' },
      caption: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401605001369@newsletter',
          newsletterName: 'ɢᴀᴀʀᴀ xᴍᴅ',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});