const { MessageEmbed } = require("discord.js")

module.exports = {
    run: async (bot, message, args, con, prefix) => {
        let embed = new MessageEmbed()
        .setTitle('MCBOT Economy')
        .setDescription('이코노미 기능을 활용한 명령어들을 알려드릴게요!')
        .addField('💰 돈',`\`\`\`가지고 계신 잔액을 표시해 드려요!\n사용법 : ${prefix}돈\`\`\``)
        .addField('🏆 돈 랭킹',`\`\`\`MCBOT 이코노미의 랭킹을 보여드려요!\n사용법 : ${prefix}돈 랭킹\`\`\``)
        .addField('🔁 일일보상',`\`\`\`일일보상을 획득합니다!\n사용법 : ${prefix}일일보상\`\`\``)
        .addField('기본지급',`\`\`\`이코노미 기능을 활용하기위해 유저의 정보를 기록합니다!\n사용법 : ${prefix}돈 기본지급\`\`\``)
        .setColor('#FFE4E4')
        .setTimestamp()
        .setFooter('문의 : MCHDF#9999')

        return message.channel.send(embed);
    }
}

module.exports.help = {
    name: "eco",
    aliases: ['ㄷ채'],
    category: "",
    description: ""
}

