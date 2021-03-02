const { MessageEmbed } = require("discord.js");
const usedCommand = new Set();

module.exports = {
    run: async (bot, message, args, con) => {

        if (usedCommand.has(message.author.id)) {
            return message.reply(`:arrows_counterclockwise: 아직 쿨타임이 끝나지 않았어요!`)
        } else {
            usedCommand.add(message.author.id);
            setTimeout(() => {
                usedCommand.delete(message.author.id);
            }, 10000);
        }

        let user = message.author;

        const love = Math.random() * 100;
        const loveindex = Math.floor(love / 10);
        if (loveindex > 100) {
            loveindex = 100;
        }
        const loveLevel = "💖".repeat(loveindex) + "💔".repeat(10 - loveindex);


        let embed = new MessageEmbed()
            .setAuthor(user.username, user.displayAvatarURL())
            .setColor('#FEB1FF')
            .setDescription(`\`\`${user.username}\`\`님! 전 당신을...이만큼 사랑해요!`)
            .addField(`💟 ${love.toFixed(0)}%`, loveLevel);
        return message.channel.send(embed);
    }
}

module.exports.help = {
    name: "love",
    aliases: ['Love', 'ㅣㅐㅍㄷ'],
    category: "",
    description: ""
}