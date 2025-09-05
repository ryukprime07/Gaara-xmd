const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;

cmd({
  pattern: "creategc",
  category: "group",
  desc: "Create a group with specified members.",
  filename: __filename,
  use: `${prefix}newgc GroupName number1,number2`,
  owner: true,
}, async (conn, mek, m, { body, sender, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");
    if (!body.includes(" ")) return reply(`Usage: ${prefix}newgc GroupName number1,number2`);

    // Séparer le nom du groupe et les numéros
    const firstSpaceIndex = body.indexOf(" ");
    const groupName = body.slice(0, firstSpaceIndex).trim();
    const numbersRaw = body.slice(firstSpaceIndex + 1).trim();

    if (!groupName) return reply("❌ Please provide a group name.");
    if (groupName.length > 30) return reply("❌ Group name too long (max 30 chars).");

    // Nettoyer les numéros (conserver uniquement les chiffres, minimum 10 chiffres)
    let numberList = numbersRaw.split(",")
      .map(n => n.trim().replace(/\D/g, ''))
      .filter(n => n.length >= 10);

    if (numberList.length === 0) return reply("❌ Provide at least one valid phone number (digits only).");

    // Inclure le bot lui-même dans les participants
    const me = sender.split("@")[0] + "@s.whatsapp.net";

    // Préparer la liste des participants (maximum 10 au moment de la création)
    const participants = [me, ...numberList.slice(0, 9).map(n => n + "@s.whatsapp.net")];

    // Créer le groupe
    const group = await conn.groupCreate(groupName, participants);

    // Ajouter les autres membres (au-delà de 9)
    const failedAdds = [];
    for (let i = 9; i < numberList.length; i++) {
      const jid = numberList[i] + "@s.whatsapp.net";
      try {
        await conn.groupParticipantsUpdate(group.id, [jid], "add");
      } catch (err) {
        failedAdds.push(numberList[i]);
      }
    }

    // Définir la description du groupe
    await conn.groupUpdateDescription(group.id, `Group created by @${sender.split('@')[0]}`);

    // Envoyer le message de bienvenue
    await conn.sendMessage(group.id, {
      text: `👋 *Welcome to ${groupName}!* Group created by @${sender.split('@')[0]}`,
      mentions: [sender]
    });

    // Réponse finale avec informations sur le groupe
    let response = `╭━━━━━━〔 *✅ GROUPE CRÉÉ AVEC SUCCÈS* 〕━━━━━━⬣
┃📛 *Nom du groupe* : ${groupName}
┃👥 *Membres ajoutés* : ${numberList.length - failedAdds.length}
┃
┃📎 *Lien d'invitation* : 
┃ https://chat.whatsapp.com/${await conn.groupInviteCode(group.id)}
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

    // Ajouter les numéros qui n'ont pas pu être ajoutés
    if (failedAdds.length) {
      response += `\n⚠️ Failed to add these numbers:\n${failedAdds.join(", ")}`;
    }

    return reply(response);

  } catch (e) {
    console.error(e);
    return reply(`❌ *Erreur lors de la création du groupe !*\n\n*Détail:* ${e.message}`);
  }
});
