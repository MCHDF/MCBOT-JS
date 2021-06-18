const { MessageEmbed } = require("discord.js");

module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!args[0]) {
            con.query(`SELECT money FROM Economy WHERE userId = '${message.author.id}';`, (err, rows) => {
                if (!rows[0]) {
                    return message.channel.send('유저분은 현재 MCBOT Economy 정보를 작성하지 않으셨습니다.\n:bulb: \`!돈 기본지급\`');
                }
                let money = rows[0].money;
                message.channel.send(`${message.author.username}님의 돈 : ${money.toLocaleString()}`);
            })
        } else if (args[0] === '기본지급') {
            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}';`, (err, rows) => {
                if (!rows[0]) {
                    con.query(`INSERT INTO Economy (userId, name) VALUES ('${message.author.id}', '${message.author.username}')`);
                    let embed = new MessageEmbed()
                        .setTitle('새로운 유저 출현!')
                        .setColor("GREEN")
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription('MCBOT 이코노미에 가입하신걸 환영합니다!\n해당 관련 기능을 사용 가능하도록 유저 정보를 작성합니다!')
                        .addField('[ 기본 지급액 ]', '100,000원')
                        .addField('[ 문의 ]', 'MCHDF#9999')
                        .setTimestamp()
                    return message.channel.send({ embed: embed });
                } else {
                    return message.channel.send('유저분은 이미 기본지원금을 받으셨습니다.');
                }
            })
        } else if (args[0] === '추가') {
            var user = message.mentions.users.first();
            if (message.author.id != '468781931182555136') {
                return message.channel.send('엑세스 거부');
            }
            if (!user) {
                var addMoney = parseInt(args[1]);
                user = message.author;
            } else {
                var addMoney = parseInt(args[2]);
            }
            con.query(`SELECT * FROM Economy WHERE userId = '${user.id}'`, (err, rows) => {
                if (!rows[0]) {
                    return message.channel.send('해당 유저는 이코노미 정보가 기록되어있지 않습니다.\n기능을 이용하기전에 \`!돈 기본지급\` 명령어를 통해 이코노미 정보를 생성해주세요!')
                }
                let money = rows[0].money;
                con.query(`UPDATE Economy SET money = ${money + addMoney} WHERE userId = '${user.id}'`);
                return message.channel.send(`${addMoney.toLocaleString()}원 추가 완료\n남은 잔액 : ${(money + addMoney).toLocaleString()}`)
            })
        } else if (args[0] === '제거') {
            var user = message.mentions.users.first();
            if (message.author.id != '468781931182555136') {
                return message.channel.send('엑세스 거부');
            }
            if (!user) {
                var delMoney = parseInt(args[1]);
                user = message.author;
            } else {
                var delMoney = parseInt(args[2]);
            }
            if (args[1] === '전부') {
                con.query(`SELECT * FROM Economy WHERE userId = '${user.id}'`, (err, rows) => {
                    let money = rows[0].money;
                    con.query(`UPDATE Economy SET money = 0 WHERE userId = '${user.id}'`);
                    return message.channel.send(`${money.toLocaleString()}원 제거 완료\n남은 잔액 : ${(money - money).toLocaleString()}`)
                })
            } else {
                con.query(`SELECT * FROM Economy WHERE userId = '${user.id}'`, (err, rows) => {
                    if (!rows[0]) {
                        return message.channel.send('해당 유저는 이코노미 정보가 기록되어있지 않습니다.\n기능을 이용하기전에 \`!돈 기본지급\` 명령어를 통해 이코노미 정보를 생성해주세요!')
                    }
                    let money = rows[0].money;
                    con.query(`UPDATE Economy SET money = ${money - delMoney} WHERE userId = '${user.id}'`);
                    return message.channel.send(`${delMoney.toLocaleString()}원 제거 완료\n남은 잔액 : ${(money - delMoney).toLocaleString()}`)
                })
            }

        }
    }
}

module.exports.help = {
    name: "돈",
    aliases: ['ehs'],
    category: "",
    description: ""
}