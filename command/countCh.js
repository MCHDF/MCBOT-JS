module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply(":octagonal_sign: 권한이 없어요!");
        }

        if (!args[0]) {
            let embed = new MessageEmbed()
                .setTitle("카운트 채널")
                .setDescription('서버의 유저 수를 카운트 하기위한 채널을 지정하는 명령어입니다.')
                .setColor('GREEN')
                .addField(`[ ${prefix}카운트 설정 <채널멘션> ]`, "", true)
                .addField(`[ ${prefix}카운트 변경 <채널멘션> ]`, "역할의 자동 부여를 중단합니다.", true)
                .addField(`[ ${prefix}카운트 취소 ]`, "", true)
                .addField(`[ ${prefix}카운트 이름 <변경할 이름> ]`, "", true)
            return message.channel.send({ embed: embed });
        } else if (args[0] === "설정") {
            let channel = message.mentions.channels.first();
            channel = channel.id;
            if (!channel) {
                return message.reply(":octagonal_sign: 멤버의 수를 카운트할 채널을 멘션해주세요!");
            }
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    con.query(`UPDATE GuildConfigurable SET Count = '${channel}' Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 채널 지정완료!');
                } else if (Count === channel) {
                    return message.channel.send(':bulb: 이미 해당 채널로 지정되어있습니다!');
                } else {
                    return message.channel.send(':bulb: 이미 채널이 지정되어있습니다!');
                }
            });
        } else if (args[0] === "변경") {
            let channel = message.mentions.channels.first();
            channel = channel.id;
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    return message.channel.send(':bulb: 카운트 채널을 먼저 지정해주세요!');
                } else {
                    if (!channel) {
                        return message.channel.send(':octagonal_sign: 카운트 채널을 변경할 채널을 멘션해주세요!');
                    }
                    con.query(`UPDATE GuildConfigurable SET Count = '${channel}' Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 채널 변경완료!');
                }
            });
        } else if (args[0] === "취소") {
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

            ChName = ChName.replace(`'`, "\\'");
            ChName = ChName.replace(`"`, '\\"');
            con.query(`select * from GuildConfigurable where guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                let Count = rows[0].Count;
                if (!Count) {
                    return message.channel.send(':bulb: 카운트 채널을 먼저 지정해주세요!');
                }
                if (!args[1]) {
                    return message.channel.send(':bulb: 카운트 채널의 이름을 만들어주세요!\n기본값 : \`멤버 수\`')
                } else {
                    con.query(`UPDATE GuildConfigurable SET CountChName = \'${ChName}\' Where guildId = '${message.guild.id}'`);
                    return message.channel.send(':white_check_mark: 카운트 채널 이름 변경완료!');
                }

            })
        }
    }
}

module.exports.help = {
    name: "카운트",
    aliases: ['count', 'zkdnsxm'],
    category: "",
    description: ""
}