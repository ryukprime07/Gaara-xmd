const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fancy fonts.",
  category: "convert",
  filename: __filename
}, async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  reply
}) => {
  try {
    if (!q) {
      // Si aucun texte n'est fourni
      return sendFancyList("❎ Invalid use. Please provide text to convert. Example: `.fancy 28 GAARA`.");
    }

    // Séparer le numéro de style du texte
    const [styleNumber, ...textArray] = q.split(" ");
    const textToConvert = textArray.join(" ");
    const selectedNumber = parseInt(styleNumber);

    // Vérification des cas où il manque une partie de la commande
    if (!textToConvert) {
      if (isNaN(selectedNumber)) {
        // Pas de texte et pas de numéro
        return sendFancyList("❎ Invalid use. Example: `.fancy 28 GAARA`.");
      } else {
        // Un numéro mais pas de texte
        return sendFancyList("❎ Invalid use. Please provide text. Example: `.fancy 28 GAARA`.");
      }
    }

    // Si un numéro est fourni, on passe à l'API pour obtenir le style de ce numéro
    if (selectedNumber && !isNaN(selectedNumber)) {
      const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(textToConvert)}`;
      const res = await axios.get(apiUrl);

      if (!res.data.status || !Array.isArray(res.data.result)) {
        return reply("❌ Error fetching fonts. Try again later.");
      }

      const fonts = res.data.result;

      if (selectedNumber < 1 || selectedNumber > fonts.length) {
        return reply(`❎ Invalid style number. Please choose between 1 and ${fonts.length}.`);
      }

      const chosenFont = fonts[selectedNumber - 1];  // Récupérer le style choisi
      const finalText = `✨ *Your Text in ${chosenFont.name || 'Selected Style'}:*\n\n${chosenFont.result}\n\n> *ᴩᴏᴡᴇʀᴇᴅ ʙY ɢᴀᴀʀᴀ xᴍᴅ*`;

      await conn.sendMessage(from, { text: finalText }, { quoted: m });
      return;
    }

    // Si aucun numéro n'est fourni, afficher la liste des styles avec "GAARA"
    return sendFancyList("❎ Invalid use. Example: `.fancy 28 GAARA`.");
    
  } catch (error) {
    console.error("❌ Error in .fancy:", error);
    reply("⚠️ An error occurred while processing.");
  }

  // Fonction pour envoyer la liste des styles fancy avec "GAARA XMD"
  async function sendFancyList(errorMessage) {
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent("GAARA XMD")}`;
    const res = await axios.get(apiUrl);

    if (!res.data.status || !Array.isArray(res.data.result)) {
      return reply("❌ Error fetching fonts. Try again later.");
    }

    const fonts = res.data.result;
    const maxDisplay = 44; // Limite à 44 styles

    // On prend seulement les 44 premiers styles
    const displayList = fonts.slice(0, maxDisplay);

    let menuText = "FANCY STYLES WITH GAARA XMD:\n";
    displayList.forEach((f, i) => {
      menuText += `${i + 1}. ${f.result}\n`;
    });

    await conn.sendMessage(from, { text: `${errorMessage}\n\n${menuText}` }, { quoted: m });
  }
});
