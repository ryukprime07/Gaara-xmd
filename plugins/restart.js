const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

cmd({
    pattern: "restart",
    desc: "Restart MEGALODON-MD",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("ᴏɴʟy ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.");
        }

        const { exec } = require("child_process");

        // ✅ Ajouter une réaction emoji
        await conn.sendMessage(m.chat, {
            react: {
                text: "🔄", // ou autre emoji comme "♻️", "🔁", "🔄"
                key: m.key
            }
        });

        reply("ɢᴀᴀʀᴀ-xᴍᴅ ʀᴇꜱᴛᴀʀᴛɪɴɢ...");
        await sleep(1500);
        exec("pm2 restart all");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
