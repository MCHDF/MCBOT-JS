module.exports = {
    run: async (bot, message, args, con) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply(":octagonal_sign: 권한이 없어요!")
        }

        if(args[0] === '취소') {
            con.query(`UPDATE Guilds SET logCh = null WHERE guildId = '${message.guild.id}'`);
            return message.channel.send(':white_check_mark: 로그채널 지정 취소 완료!');
        }
        
        let target = message.channel.id;
        con.query(`SELECT * FROM Guilds WHERE guildId = '${message.guild.id}'`, (err, rows) => {
            if (err) throw err;
            let logCh = rows[0].logCh;
            let guildId = rows[0].guildId;
            if (target === logCh) {
                message.channel.send(":exclamation: 이미 현재 채널로 지정되어있어요!");
            } else {
                con.query(`UPDATE Guilds SET logCh ='${target}' WHERE guildId ='${guildId}'`);
                message.channel.send(":white_check_mark: 로그 채널이 설정되었어요!");
            }
        });
    }
}

module.exports.help = {
    name: "로그",
    aliases: [''],
    category: "Loging System",
    description: "Log System Channel Select Command"
}