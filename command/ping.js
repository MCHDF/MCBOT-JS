const { MessageEmbed } = require("discord.js");

module.exports = {
    run: async (bot, message, args) => {
        
        let embed = new MessageEmbed()
        .setTitle('🏓 Ping')
        .setColor('YELLOW')
        .setAuthor(message.member.displayName())
        .setTimestamp()
        .setFooter(message.guild.name)
        .setDescription('저와 서버간의 거리를 계산중이에요...')
        const msg = await message.channel.send({ embed: embed });

        embed
        .setDescription('서버에서 공이 다시 날아왔어요!')
        .addField('🏓 Message Ping', `\`\`\`${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\`\`\``)
        .addField('🏓 Discord API Ping', `\`\`\`${Math.round(bot.ws.ping)}ms\`\`\``)
        .setColor('GREEN')

        msg.edit({embed : embed});
    }
}

module.exports.help = {
    name: "핑",
    aliases: ['핑'],
    category: "",
    description: "Pinging to Server"
}