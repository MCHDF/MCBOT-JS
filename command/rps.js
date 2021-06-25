const { MessageButton, MessageActionRow } = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
const usedCommand = new Set();
module.exports = {
    run: async (bot, message, args, con) => {
        
        if (message.guild.id != '534586842079821824') {
            if (usedCommand.has(message.author.id)) {
                return message.reply(':arrows_counterclockwise: 아직 쿨타임이 끝나지 않았어요!')
            } else {
                usedCommand.add(message.author.id);
                setTimeout(() => {
                    usedCommand.delete(message.author.id);
                }, 10000);
            }
        }
        const rps1 = new MessageButton()
        .setID('rps_1')
        .setLabel('가위')
        .setEmoji('✌')
        .setStyle('grey')

        const rps2 = new MessageButton()
        .setID('rps_2')
        .setLabel('바위')
        .setEmoji('✊')
        .setStyle('grey')
        
        const rps3 = new MessageButton()
        .setID('rps_3')
        .setLabel('보')
        .setEmoji('🖐')
        .setStyle('grey')

        const row = new MessageActionRow()
        .addComponent(rps1)
        .addComponent(rps2)
        .addComponent(rps3)

        const embed = new MessageEmbed()
            .setColor('#95fcff')
            .setAuthor(`도전자 - ${message.author.tag}`, message.author.avatarURL({ size: 2048 }))
            .setTitle('미니게임 - 가위바위보')
            .setDescription('아래의 3개 버튼 중 하나를 골라주세요!')
            .setTimestamp();

        message.channel.send({ 
            embed: embed,
            component: row
        });
    }
}

module.exports.help = {
    name: "rps",
    aliases: ['겐'],
    category: "Funny Game",
    description: ""
}

