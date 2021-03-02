const { MessageEmbed } = require("discord.js");
const { promptMessage } = require('../config/function.js');
const chooseArr = ["🖐", "✌", "✊"]
const usedCommand = new Set();
module.exports = {
    run: async (bot, message, args, con) => {
        message.delete();
        if(message.guild.id != '534586842079821824') {
            if(usedCommand.has(message.author.id)) {
                return message.reply(':arrows_counterclockwise: 아직 쿨타임이 끝나지 않았어요!')
            } else {
                usedCommand.add(message.author.id);
                setTimeout(() => {
                    usedCommand.delete(message.author.id);
                }, 10000);
            }
        }
        

        const embed = new MessageEmbed()
            .setColor('#95fcff')
            .setAuthor(`도전자 - ${message.author.tag}`, message.author.avatarURL({ size: 2048 }))
            .setTitle('미니게임 - 가위바위보')
            .setDescription('아래의 3개 반응 중 하나를 골라주세요!')
            .setTimestamp(message.createAt);

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        const botchoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botchoice);
        await m.reactions.removeAll();

        embed
            .setDescription("")
            .addField(result, `유저 ${reacted} vs ${botchoice} 봇`)

        m.edit(embed);

        if ((reacted === "✊" && botchoice === "✌") ||
            (reacted === "🖐" && botchoice === "✊") ||
            (reacted === "✌" && botchoice === "🖐")) {
            con.query(`SELECT * FROM xp WHERE guildId = '${message.guild.id}' AND id = '${message.author.id}'`, (err, rows) => {
                if (err) throw err;
                let xp = rows[0].xp;
                let lvl = rows[0].lvl;
                if (lvl <= 4) {
                    con.query(`UPDATE xp Set xp = ${xp + 100} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 5 || lvl <= 9) {
                    con.query(`UPDATE xp Set xp = ${xp + 130} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 10 || lvl <= 14) {
                    con.query(`UPDATE xp Set xp = ${xp + 150} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 15 || lvl <= 19) {
                    con.query(`UPDATE xp Set xp = ${xp + 180} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 20 || lvl <= 24) {
                    con.query(`UPDATE xp Set xp = ${xp + 220} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 25 || lvl <= 29) {
                    con.query(`UPDATE xp Set xp = ${xp + 250} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 30 || lvl <= 34) {
                    con.query(`UPDATE xp Set xp = ${xp + 290} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 35 || lvl <= 39) {
                    con.query(`UPDATE xp Set xp = ${xp + 320} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 40 || lvl <= 44) {
                    con.query(`UPDATE xp Set xp = ${xp + 360} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 45 || lvl <= 49) {
                    con.query(`UPDATE xp Set xp = ${xp + 390} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 50) {
                    con.query(`UPDATE xp Set xp = ${xp + 400} WHERE id = '${message.author.id}'`);
                } else if (lvl >= 75) {
                    con.query(`UPDATE xp Set xp = ${xp + 500} WHERE id = '${message.author.id}'`);
                }
            })
        }

        function getResult(me, botChosen) {
            if ((me === "✊" && botChosen === "✌") ||
                (me === "🖐" && botChosen === "✊") ||
                (me === "✌" && botChosen === "🖐")) {
                return "승리하셨습니다!";
            } else if (me === botChosen) {
                return "무승부입니다!";
            } else {
                return "패배하셨습니다!";
            }
        }
    }
}

module.exports.help = {
    name: "rps",
    aliases: ['정보', '유저'],
    category: "Funny Game",
    description: ""
}

