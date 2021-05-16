const { MessageEmbed } = require("discord.js");

module.exports = {
    run: async (bot, message, args, con) => {
        if (args[0] === '취소') {
            
            let gid = message.guild.id;

            if (message.deletable) {
                message.delete();
            }
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                return message.reply(":octagonal_sign: 자동 역할 부여를 취소할 권한을 가지고 있지않아요!").then(m => m.delete({ timeout: 3000 }));
            }
            con.query(`SELECT * FROM Guilds WHERE guildId = '${gid}'`, (err, rows) => {
                if (err) throw err;
                let autoRole = rows[0].autoRole;
                let logCh = rows[0].logCh;
                if (!logCh) {
                    return message.channel.send(':exclamation:  기능을 사용하기 전에, 로그채널을 먼저 설정해주세요!').then(m => m.delete({ timeout: 3000 }));
                }
                if (!autoRole) {
                    return message.channel.send(':exclamation:  자동으로 부여하고있는 역할이 이미 없어요!').then(m => m.delete({ timeout: 5000 }));
                } else {
                    let ch = bot.channels.cache.get(`${logCh}`);
                    let ROLE = message.guild.roles.cache.get(`${autoRole}`);
                    con.query(`UPDATE Guilds SET autoRole = NULL WHERE guildId = '${gid}'`);
                    let embed = new MessageEmbed()
                        .setTitle('역할 자동부여 취소')
                        .setColor('#FF9A00')
                        .setTimestamp()
                        .setFooter(`${message.guild.name}`)
                        .addField('[ 역할 ]', `${ROLE.name}`);
                    ch.send(embed);
                    return message.channel.send(':white_check_mark: 역할 자동부여 취소가 완료되었어요!').then(m => m.delete({ timeout: 5000 }));;
                }
            })
        } else {
            let ROLE = message.mentions.roles.first();
            let gid = message.guild.id;
            if (!message.member.hasPermission(["ADMINISTRATOR"])) {
                return message.reply(":octagonal_sign: 권한이 없어요!").then(m => m.delete({ timeout: 3000 }));
            }
            if (!ROLE) {
                return message.channel.send(":exclamation: 역할을 멘션해주세요!").then(m => m.delete({ timeout: 3000 }));
            }
            con.query(`SELECT * FROM Guilds WHERE guildId = '${gid}'`, (err, rows) => {
                if (err) throw err;
                let autoRole = rows[0].autoRole;
                let logCh = rows[0].logCh;
                if (!logCh) {
                    return message.channel.send(':exclamation: 기능을 사용하기 전에, 로그채널을 먼저 설정해주세요!').then(m => m.delete({ timeout: 3000 }));
                }
                if (!autoRole) {
                    let ch = bot.channels.cache.get(`${logCh}`);
                    con.query(`UPDATE Guilds SET autoRole = '${ROLE.id}' WHERE guildId = '${gid}'`);
                    let embed = new MessageEmbed()
                        .setTitle('역할 자동부여')
                        .setColor('#37E51C')
                        .setTimestamp()
                        .setFooter(`${message.guild.name}`)
                        .addField('[ 역할 ]', `${ROLE.name}`)
                    ch.send(embed);
                    return message.channel.send(':white_check_mark: 자동부여 역할 설정 완료!').then(m => m.delete({ timeout: 5000 }));
                } else {
                    let ch = bot.channels.cache.get(`${logCh}`);
                    con.query(`UPDATE Guilds SET autoRole = '${ROLE.id}' WHERE guildId = '${gid}'`);
                    let embed = new MessageEmbed()
                        .setTitle('역할 자동부여 업데이트')
                        .setColor('#EE3ADD')
                        .setTimestamp()
                        .setFooter(`${message.guild.name}`)
                        .addField('[ 역할 ]', `${ROLE.name}`)
                    ch.send(embed);
                    return message.channel.send(':white_check_mark: 자동부여 역할 업데이트 완료!').then(m => m.delete({ timeout: 5000 }));
                }
            })
        }
    }
}

module.exports.help = {
    name: "자동역할",
    aliases: ['오토롤','wkehddurgkf'],
    category: "",
    description: ""
}