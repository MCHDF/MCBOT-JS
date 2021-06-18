const { MessageEmbed } = require("discord.js");
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (message.guild.id === '534586842079821824') {
            return message.channel.send("해당 길드 사용 중지"); // 일단 이건 상황보고 결정하는걸로
        }
        if (!args[0]) {
            let embed = new MessageEmbed()
                .setTitle("**명령어 도움말**")
                .setColor("#FFE4E4")
                .setAuthor("MCBOT", "https://i.imgur.com/Togof5u.png")
                .setThumbnail("https://i.imgur.com/Togof5u.png")
                .setDescription('모든 명령어는 ' + prefix + ' 를 붙여 사용합니다.')
                .setFooter(`Request by ${message.author.tag} • 문의 : MCHDF#9999`)
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                embed
                    .addField("경고 보기", "```자신의 경고 상황을 표시합니다!\n사용법 : " + prefix + "경고 보기```")
                return message.channel.send({ embed: embed });
            } else {
                embed
                    .addField("경고 보기", "```자신의 경고 상황을 표시합니다!\n사용법 : " + prefix + "경고 보기```")
                    .addField('\u200B', '**운영자 전용 명령어**')
                    .addField("경고 추가", "```멘션한 유저에게 경고를 추가시켜요!\n관리자 권한이 필요하고, 이유가 꼭 필요해요!\n사용법 : " + prefix + "경고 추가 <횟수> <멘션> <이유>```")
                    .addField("경고 취소", "```멘션한 유저의 경고를 취소시켜요!\n관리자 권한이 필요해요!\n사용법 : " + prefix + "경고 취소 <횟수> <멘션>```")
                    .addField("경고 유저", "```유저의 경고 상황을 표시합니다!\n관리자 권한이 필요해요!\n사용법 : " + prefix + "경고 유저 <멘션>```");
                return message.channel.send({ embed: embed });
            }
        }
        if (args[0] === '보기') {
            let user = message.author;
            let avatar = user.avatarURL({ size: 2048 });
            let gid = message.guild.id;
            if (message.deletable) {
                message.delete();
            }
            con.query(`SELECT * FROM warnUser WHERE guildID = '${gid}' AND Id = '${user.id}'`, (err, rows) => {
                if (!rows[0]) {
                    let embed = new MessageEmbed()
                        .setAuthor(`${user.tag}`, avatar)
                        .setColor('#ff0000')
                        .setTimestamp()
                        .setThumbnail(avatar)
                        .setFooter(`Request By ${message.author.tag}`)
                        .addField('[ 유저 이름 ]', `<@${user.id}>`, true)
                        .addField('[ 경고 횟수 ]', '0')
                    return message.channel.send({ embed: embed });
                }
                if (err) throw err;
                let embed = new MessageEmbed()
                    .setAuthor(`${user.tag}`, avatar)
                    .setColor('#ff0000')
                    .setTimestamp()
                    .setThumbnail(avatar)
                    .setFooter(`Request By ${user.tag}`)
                    .addField('[ 유저 이름 ]', `<@${user.id}>`, true)
                    .addField('[ 경고 횟수 ]', rows[0].warning)
                return message.channel.send({ embed: embed });
            });
        } else if (args[0] === '추가') {
            if (message.deletable) {
                message.delete();
            }
            let user = message.mentions.users.first();
            let gid = message.guild.id;
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                return message.reply(":octagonal_sign: 권한이 없어요!").then(m => m.delete({ timeout: 3000 }));
            }
            if (!user) {
                return message.channel.send(":loudspeaker:  유저를 멘션해주세요!").then(m => m.delete({ timeout: 3000 }));
            }
            if (isNaN(args[1]) || parseInt(args[1]) <= 0) {
                return message.reply(":exclamation: 추가할 경고 횟수를 입력해주세요!").then(m => m.delete({ timeout: 3000 }));
            }
            let countWarn;
            if (parseInt(args[1]) > 100) {
                countWarn = 100;
            } else {
                countWarn = parseInt(args[1]);
            }
            var reason = args.slice(3).join(" ");
            if (!reason) {
                reason = '이유 없음'
            }

            con.query(`SELECT * FROM Guilds WHERE guildId = '${gid}'`, (err, rows) => {
                const logCh = rows[0].logCh;
                if (!logCh) {
                    return message.channel.send(":exclamation: 기능을 사용하기 전에, 로그채널을 먼저 설정해주세요!").then(m => m.delete({ timeout: 3000 }));
                }
                con.query(`SELECT * FROM warnUser WHERE guildID = '${gid}' AND Id = '${user.id}'`, (err, rows) => {
                    if (err) throw err;
                    let avatar = user.avatarURL({ size: 2048 });
                    let embed = new MessageEmbed()
                        .setAuthor(`${user.tag}`, avatar)
                        .setColor('#ff0000')
                        .setTimestamp()
                        .setThumbnail(avatar)
                        .setFooter(`Request By ${message.author.tag}`)
                        .addField('[ 유저 이름 ]', `<@${user.id}>`, true)
                        .addField('[ 유저 태그 ]', user.tag, true)
                        .addField('[ 유저 ID ]', user.id, true)
                    let ch = bot.channels.cache.get(`${logCh}`);
                    if (rows.length < 1) {
                        con.query(`INSERT INTO warnUser (guildID, Id, name, warning) VALUES ('${gid}', '${user.id}', '${user.username}', ${countWarn});`);
                        con.query(`SELECT * FROM warnUser WHERE guildID = '${gid}' AND Id = '${user.id}'`, (err, rows) => {
                            embed
                                .addField('[ 경고 횟수 ]', rows[0].warning)
                                .addField('[ 이유 ]', reason);
                            ch.send({ embed: embed });
                            return message.channel.send(":white_check_mark: 경고 부여 완료!").then(m => m.delete({ timeout: 3000 }));
                        });
                    } else {
                        con.query(`UPDATE warnUser SET warning = ${rows[0].warning + countWarn} WHERE guildID = ${gid} AND Id = ${user.id}`);
                        con.query(`SELECT * FROM warnUser WHERE guildID = '${gid}' AND Id = '${user.id}'`, (err, rows) => {
                            if (err) throw err;
                            embed
                                .addField('[ 경고 횟수 ]', rows[0].warning)
                                .addField('[ 이유 ]', reason);
                            ch.send({ embed: embed });
                            return message.channel.send(":white_check_mark: 경고 부여 완료!").then(m => m.delete({ timeout: 3000 }));
                        });
                    }
                });
            });
        } else if (args[0] === '취소') {
            if (message.deletable) {
                message.delete();
            }
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                return message.reply(":octagonal_sign: 권한이 없어요!").then(m => m.delete({ timeout: 3000 }));
            }
            if (isNaN(args[1]) || parseInt(args[1]) <= 0) {
                return message.reply(":exclamation: 취소할 경고 횟수를 입력해주세요!").then(m => m.delete({ timeout: 3000 }));
            }
            let countWarn;
            if (parseInt(args[1]) > 100) {
                countWarn = 100;
            } else {
                countWarn = parseInt(args[1]);
            }
            let user = message.mentions.users.first();
            if (!user) {
                return message.channel.send(":loudspeaker: 유저를 멘션해주세요!");
            }

            con.query(`SELECT * FROM Guilds WHERE guildId = '${message.guild.id}'`, (err, rows) => {
                if (err) throw err;
                const logCh = rows[0].logCh;
                let ch = bot.channels.cache.get(`${logCh}`);
                let avatar = user.avatarURL({ size: 2048 });
                let embed = new MessageEmbed()
                    .setAuthor(`${user.tag}`, avatar)
                    .setColor('#ff0000')
                    .setTimestamp()
                    .setThumbnail(avatar)
                    .setFooter(`Request By ${message.author.tag}`)
                    .addField('[ 유저 이름 ]', `<@${user.id}>`, true)
                    .addField('[ 유저 태그 ]', user.tag, true)
                    .addField('[ 유저 ID ]', user.id, true)

                con.query(`SELECT * FROM warnUser WHERE guildID = '${message.guild.id}' AND Id = '${user.id}'`, (err, rows) => {
                    if (err) throw err;
                    if (rows.length < 1) {
                        return message.channel.send(":exclamation: 해당 유저는 경고를 받은적이 없는것 같아요!").then(m => m.delete({ timeout: 5000 }));
                    }
                    let warning = rows[0].warning
                    if (warning <= countWarn) {
                        con.query(`UPDATE warnUser SET warning = 0 WHERE guildID = ${message.guild.id} AND Id = ${user.id}`);
                        embed
                            .setTitle(`모든 경고 취소`)
                            .addField('[ 경고 횟수 ]', '0')
                        ch.send({ embed: embed });
                        return message.channel.send(":white_check_mark: 해당 유저의 경고가 취소되었어요!").then(m => m.delete({ timeout: 5000 }));
                    }
                    warning = warning - countWarn;
                    con.query(`UPDATE warnUser SET warning = ${warning} WHERE guildID = ${message.guild.id} AND Id = ${user.id}`);
                    embed
                        .setTitle(`경고 ${countWarn}}회 취소`)
                        .addField('[ 경고 횟수 ]', warning)
                    ch.send({ embed: embed });
                    return message.channel.send(":white_check_mark: 해당 유저의 경고가 취소되었어요!").then(m => m.delete({ timeout: 5000 }));
                });
            });
        } else if (args[0] === '유저') {
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                return message.reply(":octagonal_sign: 권한이 없어요!").then(m => m.delete({ timeout: 3000 }));
            }
            let user = message.mentions.users.first();
            let avatar = user.avatarURL({ size: 2048 });
            let gid = message.guild.id;
            if (message.deletable) {
                message.delete();
            }
            if (!user) {
                message.channel.send(':loudspeaker: 유저를 멘션해주세요!');
            }
            con.query(`SELECT * FROM warnUser WHERE guildID = '${gid}' AND Id = '${user.id}'`, (err, rows) => {
                if (!rows[0]) {
                    let embed = new MessageEmbed()
                        .setAuthor(`${user.tag}`, avatar)
                        .setColor('#ff0000')
                        .setTimestamp()
                        .setThumbnail(avatar)
                        .setFooter(`Request By ${user.tag}`)
                        .addField('[ 유저 이름 ]', `<@${user.id}>`, true)
                        .addField('[ 경고 횟수 ]', '0')
                    return message.channel.send({ embed: embed });
                }
                if (err) throw err;
                let embed = new MessageEmbed()
                    .setAuthor(`${user.tag}`, avatar)
                    .setColor('#ff0000')
                    .setTimestamp()
                    .setThumbnail(avatar)
                    .setFooter(`Request By ${message.author.tag}`)
                    .addField('[ 유저 이름 ]', `<@${user.id}>`, true)
                    .addField('[ 경고 횟수 ]', rows[0].warning)
                return message.channel.send({ embed: embed });
            });
        }
    }
}

module.exports.help = {
    name: "경고",
    aliases: [''],
    category: "Warning System",
    description: "Warnin System Command"
}

