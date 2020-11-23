module.exports = {
    run: async (bot, message, args, con, prefix) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply(":octagonal_sign: 권한이 없어요!")
        }

        if(!args[0]) {
            return message.channel.send(`🎶 \`${prefix}음악채널 지정 (지정할 채널에서 명령어를 사용해주세요!)\`\n🎶 \`${prefix}음악채널 취소\``)
        }

        if(args[0] === '취소') {
            con.query(`UPDATE Guilds SET musicCh = null WHERE guildId = '${message.guild.id}'`);
            return message.channel.send(':white_check_mark: 음악전용 채널 지정 취소 완료!');
        } else if(args[0] === '지정') {
            let target = message.channel.id;
            con.query(`SELECT * FROM Guilds WHERE guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let musicCh = rows[0].musicCh;
                let guildId = rows[0].guildId;
                if (target === musicCh) {
                    message.channel.send(":exclamation: 이미 현재 채널로 지정되어있어요!").then(m => m.delete({ timeout: 3000 }));
                } else {
                    con.query(`UPDATE Guilds SET musicCh ='${target}' WHERE guildId ='${guildId}'`);
                    message.channel.send(":white_check_mark: 음악전용 채널이 설정되었어요!").then(m => m.delete({ timeout: 3000 }));
                }
            });
        }
    }
}

module.exports.help = {
    name: "음악채널",
    aliases: [''],
    category: "",
    description: ""
}