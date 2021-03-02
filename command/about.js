const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');

module.exports = {
    run: async (bot, message, args) => {

        message.delete();
        message.reply("개인 DM을 확인해주세요!").then(m => m.delete({ timeout: 3000 }));
        let createdate = dateFormat(bot.user.createdAt, 'yyyy.mm.dd');
        let embed = new MessageEmbed()
            .setURL("https://github.com/MCHDF")
            .setTitle(`${bot.user.username}에 대해...`)
            .setColor("#FFE4E4")
            .setDescription("여러가지 유틸과 유머 기능, 음악 기능을 탑재한 봇이에요!")
            .setTimestamp()
            .setThumbnail(bot.user.displayAvatarURL())
            .addField("[ 봇 이름 ]", "MCBOT#2244", true)
            .addField("[ 소유자 ]", "MCHDF#9999", true)
            .addField("[ 지역 ]", ":flag_kr:")
            .addField("[ 생일 ]", createdate)
            .addField("[ NPM ]", "6.14.11", true)
            .addField("[ Code ]", 'Discord JS v12.5.1',true)
            .addField("[ Node.js ]", 'v14.15.3',true)
            .addField("[ 길드 ]", `**${bot.guilds.cache.size}**개`, true)
            .addField("[ 유저 (중복 포함) ]", `**${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}**명`, true)
            .addField("[ 채널 ]", `**${bot.channels.cache.size}**개`, true)
            .setFooter("[ 문의 ] : MCHDF#9999")
        message.fetch(message.id).then(m => {
            m.react("💰");
        });
        return message.author.send(embed);
    }
}

module.exports.help = {
    name: "about",
    aliases: ['봇정보', '봇', 'bot','뮤ㅐㅕㅅ'],
    category: "moderation",
    description: "Information About MCBOT"
}
