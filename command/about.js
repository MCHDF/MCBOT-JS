const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    run: async (bot, message, args) => {

        const notion = new MessageButton()
        .setLabel('Notion')
        .setEmoji('💡')
        .setStyle('url')
        .setURL('https://www.notion.so/mccounter/MCBOT-4105c7e176a1424fbd1398fea7d084e8')

        const github = new MessageButton()
        .setLabel('Github')
        .setEmoji('👾')
        .setStyle('url')
        .setURL('https://github.com/MCHDF')

        const row = new MessageActionRow()
        .addComponent(notion)
        .addComponent(github)

        let createdate = dateFormat(bot.user.createdAt, 'yyyy.mm.dd');
        let embed = new MessageEmbed()
            .setTitle(`${bot.user.username}에 대해...`)
            .setColor("#FFE4E4")
            .setDescription("여러가지 유틸리티와 음악 재생 기능을 탑재한 봇이에요!")
            .setTimestamp()
            .setThumbnail(bot.user.displayAvatarURL())
            .addField("[ 봇 이름 ]", "MCBOT#2244", true)
            .addField("[ 소유자 ]", "MCHDF#9999", true)
            .addField("[ 지역 ]", 
            ":flag_kr:")
            .addField("[ 생일 ]", createdate)
            .addField("[ 길드 ]", `**${bot.guilds.cache.size}**개`, true)
            .addField("[ 유저 (중복 포함) ]", `**${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}**명`, true)
            .addField("[ 채널 ]", `**${bot.channels.cache.size}**개`, true)
            .setFooter("[ 문의 ] : MCHDF#9999")
        return message.channel.send({
            embed: embed,
            component: row
        });
    }
}

module.exports.help = {
    name: "about",
    aliases: ['봇정보', '봇', 'bot','뮤ㅐㅕㅅ'],
    category: "moderation",
    description: "Information About MCBOT"
}
