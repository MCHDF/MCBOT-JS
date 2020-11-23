const Discord = require('discord.js');
const fs = require("fs");
const mysql = require('mysql');
const bot = new Discord.Client();
const Badwords = require("./jsons/fiterWords.json");
const log = require('./config/logger.js');
require('dotenv').config();

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./command/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("명령어를 찾지 못했어요...");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./command/${f}`);
        console.log(`[ ${f} ] load Complete`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name)
        })
    });
});

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

con.connect(err => {
    if (err) throw err;
    console.log('데이터베이스 연결 완료!');
});

function generatexp() {
    let min = 1;
    let max = 5;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

bot.on('ready', () => {
    console.log(`┌────────────────────────────┐`);
    console.log(`│ 봇 ${bot.user.username}이 작동 시작합니다!│`);
    console.log(`└────────────────────────────┘`);
    let statuses = [
        `!help`,
        `문의 : MCHDF#9999`,
        `길드 : ${bot.guilds.cache.size}개`,
        `유저 : ${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}명`,
        `채널 : ${bot.channels.cache.size}개`,
        `MCprefix로 서버별 접두사 확인`
    ]

    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, { type: "PLAYING" });
    }, 3000);
});

bot.on('guildCreate', (guild) => {
    log.info(`MCBOT이 새로운 길드에 초대됨. 길드 : ${guild.name}`);
    try {
        con.query(`INSERT INTO Guilds (guildId, GuildOwnerId) VALUES('${guild.id}', ${guild.ownerID});`);
        con.query(`INSERT INTO GuildConfigurable (guildId) VALUES('${guild.id}');`);
    } catch (err) {
        log.error(`Error while joining guild ${err}`)
    }
});

bot.on('guildDelete', async (guild) => {
    log.info(`MCBOT이 길드에서 퇴장됨. 길드 : ${guild.name}`);
    try {
        await con.query(`DELETE FROM Guilds WHERE guildId = '${guild.id}';`);
        await con.query(`DELETE FROM xp WHERE guildId = '${guild.id}';`);
        await con.query(`DELETE FROM GuildConfigurable WHERE guildId = '${guild.id}';`);
    } catch (err) {
        log.error(`Error while exiting guild ${err}`)
    }
})

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefixSet = JSON.parse(fs.readFileSync('./jsons/prefixSet.json', 'utf-8'));

    if (!prefixSet[message.guild.id]) {
        prefixSet[message.guild.id] = {
            prefixSet: '!'
        };
    }

    let prefix = prefixSet[message.guild.id].prefixSet;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let filterwords = Badwords.BADWORDS;
    let messageURL = Badwords.messageURL;
    let foundText = false;

    // 서버 멤버 카운트
    let Guild = message.guild.id;
    con.query(`select * from GuildConfigurable where guildId = '${Guild}';`, (err, rows) => {
        if (err) throw err;
        let guildId = rows[0].guildId;
        let Count = rows[0].Count;
        let ChName = rows[0].CountChName;
        if (!Count) {
            return;
        }
        let myGuild = bot.guilds.cache.get(`${guildId}`);
        let memberCount = myGuild.memberCount;
        let memberCountChannel = myGuild.channels.cache.get(`${Count}`);
        if (!ChName) {
            memberCountChannel.setName('멤버 수 : ' + memberCount);
        } else {
            memberCountChannel.setName(`${ChName} : ` + memberCount);
        }
    });

    for (var i in filterwords) {
        if (message.content.toLowerCase().includes(filterwords[i].toLowerCase())) {
            foundText = true;
        }
    }
    for (var k in messageURL) {
        if (message.content.toLowerCase().includes(messageURL[k].toLowerCase())) {
            foundText = false;
        }
    }

    let messagechid = message.channel.id;
    con.query(`SELECT * FROM Guilds WHERE guildId = '${message.guild.id}';`, (err, rows) => {
        if (err) throw err;
        let exceptionCh = rows[0].exceptionCh;
        if (!exceptionCh) {
            return;
        }
        if (foundText) {
            if (messagechid === exceptionCh) {
                return;
            } else {
                message.delete();
                message.reply("(이쁜말)");
            }
        }
    });

    //xp 시스템
    con.query(`SELECT * FROM xp WHERE guildId = '${message.guild.id}' AND id = '${message.author.id}';`, (err, rows) => {
        if (err) throw err;

        if (rows.length < 1) {
            con.query(`INSERT INTO xp (guildId, id, xp, name) VALUES ('${message.guild.id}', '${message.author.id}', ${generatexp()}, '${message.author.username}');`);
        } else {
            let xp = rows[0].xp;
            let lvl = rows[0].lvl;
            con.query(`UPDATE xp Set xp = ${xp + generatexp()} WHERE guildId = '${message.guild.id}' AND id = '${message.author.id}';`);

            let nxtlvl = lvl * 300

            if (nxtlvl <= xp) {
                con.query(`UPDATE xp SET xp = 0 WHERE guildId = '${message.guild.id}' AND id = ${message.author.id};`);
                con.query(`UPDATE xp SET lvl = ${lvl + 1} WHERE guildId = '${message.guild.id}' AND id = ${message.author.id};`);
                let embed = new Discord.MessageEmbed()
                    .setTitle('[ Level UP! ]')
                    .setAuthor(`${message.author.tag}`)
                    .setColor('#44f947')
                    .setTimestamp(message.createAt)
                message.channel.send(embed)
            }
        }
    });

    if (message.content === 'MCprefix') {
        return message.channel.send(`:bulb: 현재 서버의 접두사는 \`${prefix}\` 입니다!`);
    }
    if (message.content === prefix) {
        return;
    }

    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
    if (commandfile) {
        commandfile.run(bot, message, args, con, prefix);
        log.info(`${message.author.username} uses command '${cmd.slice(prefix.length)}' in ${message.guild.name}`);
    }

});

bot.on('guildMemberAdd', member => {
    let Guild = member.guild.id;
    con.query(`SELECT * FROM Guilds WHERE guildId = '${member.guild.id}';`, (err, rows) => {
        let logCh = rows[0].logCh;
        let ch = bot.channels.cache.get(`${logCh}`);
        let avatar = member.user.avatarURL({ size: 1024 });

        if (!logCh) {
            return;
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle('환영합니다!')
                .setColor('#37E51C')
                .setTimestamp()
                .setThumbnail(avatar)
                .setFooter(`${member.guild.name}`)
                .addField('[ 유저 이름 ]', `<@${member.user.id}>`)
                .addField('[ 유저 태그 ]', member.user.tag)
            ch.send(embed);
        }
        let autoRole = rows[0].autoRole;
        if (!autoRole) {
            return;
        } else {
            member.roles.add(autoRole);
        }
    });
    // 서버 멤버 카운트
    con.query(`select * from GuildConfigurable where guildId = '${Guild}';`, (err, rows) => {
        if (err) throw err;
        let guildId = rows[0].guildId;
        let Count = rows[0].Count;
        let ChName = rows[0].CountChName;
        if (!Count) {
            return;
        }
        let myGuild = bot.guilds.cache.get(`${guildId}`);
        let memberCount = myGuild.memberCount;
        let memberCountChannel = myGuild.channels.cache.get(`${Count}`);
        if (!ChName) {
            memberCountChannel.setName('멤버 수 : ' + memberCount);
        } else {
            memberCountChannel.setName(`${ChName} : ` + memberCount);
        }

    });
});

bot.on('guildMemberRemove', member => {
    let Guild = member.guild.id;
    con.query(`DELETE FROM xp WHERE id = '${member.id}';`);
    con.query(`SELECT * FROM Guilds WHERE guildId = '${member.guild.id}';`, (err, rows) => {
        let logCh = rows[0].logCh;
        let ch = bot.channels.cache.get(`${logCh}`);
        let avatar = member.user.avatarURL({ size: 1024 });
        if (!logCh) {
            return;
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle('안녕히 가세요!')
                .setColor('#ff0000')
                .setTimestamp()
                .setThumbnail(avatar)
                .setFooter(`${member.guild.name}`)
                .addField('[ 유저 이름 ]', `<@${member.user.id}>`)
                .addField('[ 유저 태그 ]', member.user.tag)
            ch.send(embed);
        }
    });
    con.query(`select * from GuildConfigurable where guildId = '${Guild}';`, (err, rows) => {
        if (err) throw err;
        let guildId = rows[0].guildId;
        let Count = rows[0].Count;
        let ChName = rows[0].CountChName;
        if (!Count) {
            return;
        }
        let myGuild = bot.guilds.cache.get(`${guildId}`);
        let memberCount = myGuild.memberCount;
        let memberCountChannel = myGuild.channels.cache.get(`${Count}`);
        if (!ChName) {
            memberCountChannel.setName('멤버 수 : ' + memberCount);
        } else {
            memberCountChannel.setName(`${ChName} : ` + memberCount);
        }

    });
});

bot.on('guildMemberUpdate', member => {
    con.query(`UPDATE xp Set name = '${member.user.username}' WHERE id = '${member.id}';`, (err) => {
        if(err) member.send(`유저분의 정보를 업데이트 하는데 문제가 생겼어요! 아래의 내용을 MCHDF#9999로 알려주세요!\n\`\`\`js\n${err}\`\`\``);
    });
    con.query(`UPDATE warnUser SET name = '${member.user.username}' WHERE id = '${member.id}';`);
});

bot.login(process.env.MCBOT_TOKEN);
