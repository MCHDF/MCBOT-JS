module.exports = {
    run: async (bot, message, args, con) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply(":octagonal_sign: 권한이 없어요!")
        }

        if (!args[0]) {
            let embed = new MessageEmbed()
                .setTitle("필터제외")
                .setDescription('욕설 필터링을 제외할 채널을 지정하는데 사용하는 명령어입니다.')
                .setColor('GREEN')
                .addField(`[ ${prefix}필터제외 지정 ]`, "사용한 채널을 욕설 필터링 제외 채널로 지정해요!", true)
                .addField(`[ ${prefix}필터제외 취소 ]`, "욕설 필터링 기능을 중단시켜요!", true)
            return message.channel.send({ embed: embed });
        }

        if (args[0] === '취소') {
            con.query(`UPDATE Guilds SET exceptionCh = null WHERE guildId = '${message.guild.id}'`);
            return message.channel.send(':white_check_mark: 필터제외 채널 지정 취소 완료!');
        } else if (args[0] === '지정') {
            let target = message.channel.id;
            con.query(`SELECT * FROM Guilds WHERE guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let exceptionCh = rows[0].exceptionCh;
                let guildId = rows[0].guildId;
                if (target === exceptionCh) {
                    message.channel.send(":exclamation: 이미 현재 채널로 지정되어있어요!").then(m => m.delete({ timeout: 3000 }));
                } else {
                    con.query(`UPDATE Guilds SET exceptionCh ='${target}' WHERE guildId ='${guildId}'`);
                    message.channel.send(":white_check_mark: 필터링 제외 채널이 설정되었어요!").then(m => m.delete({ timeout: 3000 }));
                }
            });
        }
    }
}

module.exports.help = {
    name: "필터제외",
    aliases: [''],
    category: "",
    description: ""
}