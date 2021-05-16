
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (message.author.id != (await bot.fetchApplication()).owner.id) {
            message.channel.send('ACCESS_DENIED');
        } else {
            var now = new Date();	// 현재 날짜 및 시간
            var currDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` // 2021-4-2
            var tomorrow = new Date(now.setDate(now.getDate() + 1));	// 내일
            var nextDate = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}` // 2021-4-3
            con.query(`SELECT * FROM Economy WHERE name = 'MCHDF'`, (err, rows) => {
                let nextDaily = rows[0].nextDaily;
                message.channel.send(`현재 날짜 : ${currDate}`)
                message.channel.send(`내일 날짜 : ${nextDate}`)
                message.channel.send(`SQL에 저장된 날짜(MCHDF) : ${nextDaily}`)
            });
            return message.channel.send('완료')
        }
    }
}

module.exports.help = {
    name: "sql",
    aliases: [''],
    category: "",
    description: ""
}