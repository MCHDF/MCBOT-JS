module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply(":octagonal_sign: 권한이 없어요!");
        }

        if (!args[0]) {
            message.channel.send(`:bulb: \`${prefix}카운트 설정 <채널아이디>\`\n:bulb: \`${prefix}카운트 변경 <채널아이디>\`\n:bulb: \`${prefix}카운트 취소\`\n:bulb: \`${prefix}카운트 이름 <변경할 이름>\``);
            return;
        } else if (args[0] === "설정") {
            if(!args[1]) {
                return message.reply(":octagonal_sign: 멤버의 수를 카운트할 채널의 아이디를 입력해주세요!");
            }
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    con.query(`UPDATE GuildConfigurable SET Count = '${args[1]}' Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 채널 지정완료!');
                } else if (Count === args[1]) {
                    return message.channel.send(':bulb: 이미 해당 채널로 지정되어있습니다!');
                } else {
                    return message.channel.send(':bulb: 이미 채널이 지정되어있습니다!');
                }
            });
        } else if (args[0] === "변경") {
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    return message.channel.send(':bulb: 카운트 채널을 먼저 지정해주세요!');
                } else {
                    con.query(`UPDATE GuildConfigurable SET Count = '${args[1]}' Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 채널 변경완료!');
                }
            });
        } else if (args[0] === "취소"){
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    return message.channel.send(':bulb: 카운트 채널이 이미 없는것 같아요..');
                } else {
                    con.query(`UPDATE GuildConfigurable SET Count = NULL Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 취소 완료!');
                }
            });
        } else if (args[0] === '이름') {
            let ChName = args.slice(1).join(" ");
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if(err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    return message.channel.send(':bulb: 카운트 채널을 먼저 지정해주세요!');
                } 
                if(!args[1]) {
                    return message.channel.send(':bulb: 카운트 채널의 이름을 만들어주세요!\n기본값 : \`멤버 수\`')
                } else {
                    con.query(`UPDATE GuildConfigurable SET CountChName = '${ChName}' Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 채널 이름 변경완료!');
                }

            })
        }
    }
}

module.exports.help = {
    name: "카운트",
    aliases: ['count','zkdnsxm'],
    category: "",
    description: ""
}