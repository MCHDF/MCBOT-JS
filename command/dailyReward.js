const { MessageEmbed } = require("discord.js");

module.exports = {
    run: async (bot, message, args, con, prefix) => {

        var now = new Date();	// 현재 날짜 및 시간
        var currDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` // 2021-4-2
        var tomorrow = new Date(now.setDate(now.getDate() + 1));	// 내일
        var nextDate = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}` // 2021-4-3

        if (args[0] === '초기화') {
            if (message.author.id != '468781931182555136') {
                return message.channel.send('엑세스 거부');
            } else {
                con.query(`UPDATE Economy SET nextDaily = '${currDate}' WHERE userId = '${message.author.id}';`);
                return message.channel.send('일일보상 시간 카운팅을 초기화 합니다!');
            }
        } else if (!args[0]) {
            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}';`, (err, rows) => {
                if (err) throw err;

                if (!rows[0]) {
                    return message.channel.send('유저분은 현재 MCBOT Economy 정보를 작성하지 않으셨습니다.\n:bulb: \`!돈 기본지급\`');
                }

                let nextDaily = rows[0].nextDaily;
                let money = rows[0].money;
                let reward = 50000;

                if (nextDaily === nextDate) {
                    return message.reply(`이미 보상을 획득하셨습니다. 다음 보상 날짜는 \`${nextDaily}\` 입니다.`);
                }

                if (currDate === nextDaily || currDate != nextDaily) {
                    con.query(`UPDATE Economy SET money = ${money + reward} WHERE userId = '${message.author.id}';`);
                    con.query(`UPDATE Economy SET nextDaily = '${nextDate}' WHERE userId = '${message.author.id}';`);
                    con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}';`, (err, rows) => {
                        if (err) throw err;
                        let nextDaily = rows[0].nextDaily;
                        let money = rows[0].money;

                        let embed = new MessageEmbed()
                            .setTitle('일일보상 획득!')
                            .setAuthor(message.member.user.username, message.member.user.avatarURL())
                            .setThumbnail(message.member.user.avatarURL())
                            .setDescription("일일보상을 획득 하셨습니다!")
                            .setTimestamp()
                            .setColor("GREEN")
                            .addField('[ 보상 ]', `${reward.toLocaleString()}원`)
                            .addField('[ 잔액 ]', `${money.toLocaleString()}원`)
                            .addField('[ 다음 보상 ]', `${nextDaily}`)
                        return message.channel.send({ embed: embed });
                    })
                } else {
                    return message.reply(`이미 보상을 획득하셨습니다. 다음 보상 날짜는 \`${nextDaily}\` 입니다.`);
                }
            });
        }
    }
}

module.exports.help = {
    name: "일일보상",
    aliases: ['daily', 'dlfdlf', '일일'],
    category: "",
    description: ""
}