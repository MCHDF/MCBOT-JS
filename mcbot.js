const Discord = require('discord.js');
const fs = require("fs");
const mysql = require('mysql');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const Badwords = require("./jsons/fiterWords.json");
require('dotenv').config();

fs.readdir("./command/", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0) {
    console.log("명령어를 찾지 못했어요...");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require(`./command/${f}`);
    console.log(`[ ${f} ] Load Complete`);
    bot.commands.set(props.help.name, props);
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
    `채널 : ${bot.channels.cache.size}개`
  ]

  setInterval(function () {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    bot.user.setActivity(status, { type: "PLAYING" });
  }, 3000);
});

//여러 길드의 ID와 길드 창설자 ID를 DB로 추출
bot.on('guildCreate', (guild) => {
  try {
    con.query(`INSERT INTO Guilds (guildId, GuildOwnerId) VALUES('${guild.id}', ${guild.ownerID})`);
    con.query(`INSERT INTO GuildConfigurable (guildId) VALUES('${guild.id}')`);
  } catch (err) {
    console.log(err)
  }
});

bot.on('guildDelete', async (guild) => {
  try {
    await con.query(`DELETE FROM Guilds WHERE guildId = '${guild.id}'`);
    await con.query(`DELETE FROM xp WHERE guildId = '${guild.id}'`);
    await con.query(`DELETE FROM GuildConfigurable WHERE guildId = '${guild.id}'`);
  } catch (err) {
    console.log(err)
  }
})

bot.on('message', async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === 'dm') return;

  let prefixSet = JSON.parse(fs.readFileSync('./jsons/prefixSet.json', 'utf-8'));

  if (!prefixSet[msg.guild.id]) {
    prefixSet[msg.guild.id] = {
      prefixSet: '!'
    };
  }

  // 서버 멤버 카운트
  let Guild = msg.guild.id;
  con.query(`select * from GuildConfigurable where guildId = '${Guild}'`, (err, rows) => {
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

  let prefix = prefixSet[msg.guild.id].prefixSet;

  let messageArray = msg.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let filterwords = Badwords.BADWORDS;
  let msgURL = Badwords.msgURL;
  let foundText = false;

  for (var i in filterwords) {
    if (msg.content.toLowerCase().includes(filterwords[i].toLowerCase())) {
      foundText = true;
    }
  }
  for (var k in msgURL) {
    if (msg.content.toLowerCase().includes(msgURL[k].toLowerCase())) {
      foundText = false;
    }
  }

  let msgchid = msg.channel.id;
  con.query(`SELECT * FROM Guilds WHERE guildId = '${msg.guild.id}'`, (err, rows) => {
    if (err) throw err;
    let exceptionCh = rows[0].exceptionCh;
    if (!exceptionCh) {
      return;
    }
    if (foundText) {
      if (msgchid === exceptionCh) {
        return;
      } else {
        msg.delete();
        msg.reply("(이쁜말)");
      }
    }
  });

  //xp 시스템
  con.query(`SELECT * FROM xp WHERE guildId = '${msg.guild.id}' AND id = '${msg.author.id}'`, (err, rows) => {
    if (err) throw err;

    if (rows.length < 1) {
      con.query(`INSERT INTO xp (guildId, id, xp, name) VALUES ('${msg.guild.id}', '${msg.author.id}', ${generatexp()}, '${msg.author.username}')`);
    } else {
      let xp = rows[0].xp;
      let lvl = rows[0].lvl;
      con.query(`UPDATE xp Set xp = ${xp + generatexp()} WHERE guildId = '${msg.guild.id}' AND id = '${msg.author.id}'`);

      let nxtlvl = lvl * 300

      if (nxtlvl <= xp) {
        con.query(`UPDATE xp SET xp = 0 WHERE guildId = '${msg.guild.id}' AND id = ${msg.author.id}`);
        con.query(`UPDATE xp SET lvl = ${lvl + 1} WHERE guildId = '${msg.guild.id}' AND id = ${msg.author.id}`);
        let embed = new Discord.MessageEmbed()
          .setTitle('[ Level UP! ]')
          .setAuthor(`${msg.author.tag}`)
          .setColor('#44f947')
          .setTimestamp(msg.createAt)
        msg.channel.send(embed)
      }
    }
  });

  if (!msg.content.startsWith(prefix)) return;
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) {
    commandfile.run(bot, msg, args, con, prefix);
  }

});

bot.on('guildMemberAdd', member => {
  let Guild = member.guild.id;
  con.query(`SELECT * FROM Guilds WHERE guildId = '${member.guild.id}'`, (err, rows) => {
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
  con.query(`select * from GuildConfigurable where guildId = '${Guild}'`, (err, rows) => {
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
    if(!ChName) {
      memberCountChannel.setName('멤버 수 : ' + memberCount);
    } else {
      memberCountChannel.setName(`${ChName} : ` + memberCount);
    }
    
  });
});

bot.on('guildMemberRemove', member => {
  let Guild = member.guild.id;
  con.query(`DELETE FROM xp WHERE id = '${member.id}';`);
  con.query(`SELECT * FROM Guilds WHERE guildId = '${member.guild.id}'`, (err, rows) => {
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
  con.query(`select * from GuildConfigurable where guildId = '${Guild}'`, (err, rows) => {
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
    if(!ChName) {
      memberCountChannel.setName('멤버 수 : ' + memberCount);
    } else {
      memberCountChannel.setName(`${ChName} : ` + memberCount);
    }
    
  });
});

bot.on('guildMemberUpdate', member => {
  con.query(`UPDATE xp Set name = '${member.user.username}' WHERE id = '${member.id}'`);
  con.query(`UPDATE warnUser SET name = '${member.user.username}' WHERE id = '${member.id}'`);
});

bot.login(process.env.MCBOT_TOKEN);
