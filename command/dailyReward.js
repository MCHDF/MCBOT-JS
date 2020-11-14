const { MessageEmbed } = require("discord.js");
const usedCommand = new Set();

module.exports = {
    run: async (bot, message, args, con, prefix) => {

        if (args[0] === '초기화') {
            if (message.author.id != '468781931182555136') {
                return message.channel.send('엑세스 거부');
            } else {
                usedCommand.clear();
                return message.channel.send('일일보상 시간 카운팅을 초기화 합니다!');
            }
        } else if (!args[0]) {
            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}';`, (err, rows) => {
                if (!rows[0]) {
                    return message.channel.send('유저분은 현재 돈을 가지고있지 않습니다.\n:bulb: \`!돈 기본지급\`');
                } else {
                    if (usedCommand.has(message.author.id)) {
                        return message.reply(`:arrows_counterclockwise: 다음 일일 보상은 24시간 후에 다시 받으실 수 있어요!`)
                    } else {
                        usedCommand.add(message.author.id);
                        setTimeout(() => {
                            usedCommand.delete(message.author.id);
                        }, 86400000);
                    }
                    let embed = new MessageEmbed()
                        .setTitle('일일 보상 획득!')
                        .addField('[ 일일 보상 ]', '50,000원')
                        .setTimestamp()
                        .setColor('GREEN')
                        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())

                    let dailyReward = 50000;
                    con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}';`, (err, rows) => {
                        if (err) throw err;
                        let money = rows[0].money;
                        let userId = rows[0].userId;
                        con.query(`UPDATE Economy SET money = ${money + dailyReward} WHERE userId = '${userId}'`);
                    })
                    return message.channel.send(embed);
                }
            })
        }
    }
}

module.exports.help = {
    name: "일일보상",
    aliases: ['daily','dlfdlf','일일'],
    category: "",
    description: ""
}