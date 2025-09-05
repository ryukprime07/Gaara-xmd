//Give Me Credit If Using This File Give Me Credit On Your Channel ✅ 
//https://whatsapp.com/channel/0029VbAdcIXJP216dKW1253g
// Credits DybyTech - MEGALODON-MD 💜 

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363401605001369@newsletter',
        newsletterName: 'ɢᴀᴀʀᴀ xᴍᴅ',
        serverMessageId: 143,
    },
});

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description.";
        const groupMembersCount = metadata.participants.length;

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            let userPp;
            try {
                userPp = await conn.profilePictureUrl(num, 'image');
            } catch {
                userPp = fallbackPP;
            }

            if (update.action === "add" && config.WELCOME === "true") {
                const text = `> *╭─〔 ɢᴀᴀʀᴀ xᴍᴅ 〕─╮*
> | 👋 𝖍𝖊𝖞 @${userName}
> | 🏠 𝖜𝖊𝖑𝖈𝖔𝖒𝖊 𝖙𝖔 *${metadata.subject}*
> | 🔢 𝖒𝖊𝖒𝖇𝖊𝖗 #${groupMembersCount}
> | 🕒 𝖏𝖔𝖎𝖓𝖊𝖉 𝖔𝖓: *${timestamp}*
> *╰─────────╯*
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴀᴀʀᴀ ᴛᴇᴄʜ*`;

                await conn.sendMessage(update.id, {
                    image: { url: userPp },
                    caption: text,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const text = `> *╭─〔 ɢᴀᴀʀᴀ xᴍᴅ 〕─╮*
> | 😢 𝖌𝖔𝖔𝖉𝖇𝖞𝖊, @${userName}
> | 🚪 𝖞𝖔𝖚 𝖑𝖊𝖋𝖙 𝖙𝖍𝖊 𝖌𝖗𝖔𝖚𝖕.
> | 🕒 𝖙𝖎𝖒𝖊: *${timestamp}*
> | 👥 𝖓𝖔𝖜 *${groupMembersCount}* 𝖒𝖊𝖒𝖇𝖊𝖗𝖘 𝖗𝖊𝖒𝖆𝖎𝖓.
> *╰──────────╯*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢᴀᴀʀᴀ ᴛᴇᴄʜ*`;

                await conn.sendMessage(update.id, {
                    image: { url: userPp },
                    caption: text,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.WELCOME === "true") {
                const demoter = update.author.split("@")[0];
                const text = `> ╭─〔 ⛔ 𝖉𝖊𝖒𝖔𝖙𝖊 𝖓𝖔𝖙𝖎𝖈𝖊 〕─╮
> | 🔻 @${demoter} 𝖉𝖊𝖒𝖔𝖙𝖊𝖉 @${userName}
> | 🕒 𝖙𝖎𝖒𝖊: *${timestamp}*
> | 📛 𝖌𝖗𝖔𝖚𝖕: *${metadata.subject}*
> ╰─────〘 ⚙️ 𝖓𝖔𝖙𝖎𝖋𝖞 𝖘𝖞𝖘𝖙𝖊𝖒 ⚙️ 〙─────╯
`;

                await conn.sendMessage(update.id, {
                    image: { url: userPp },
                    caption: text,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.WELCOME === "true") {
                const promoter = update.author.split("@")[0];
                const text = `> ╭━ ᴘʀᴏᴍᴏᴛɪᴏɴ ᴀʟᴇʀᴛ ━━╮
> | 🤖 *@${promoter}* ᴊᴜsᴛ ᴘʀᴏᴍᴏᴛᴇᴅ *@${userName}*
> | 🕓 *ᴛɪᴍᴇ:* ${timestamp}
> | 🏷️ *ɢʀᴏᴜᴘ:* ${metadata.subject}
> ╰━━❖ ɢᴀᴀʀᴀ-xᴍᴅ ❖━━╯
`;

                await conn.sendMessage(update.id, {
                    image: { url: userPp },
                    caption: text,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
