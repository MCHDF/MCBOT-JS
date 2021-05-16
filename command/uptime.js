
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        function duration(ms) {
            let sec = Math.floor((ms / 1000) % 60).toString()
            let min = Math.floor((ms / (1000 * 60)) % 60).toString()
            let hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
            let day = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7).toString()
            let wek = Math.floor((ms / (1000 * 60 * 60 * 24 * 7)) % 5).toString()
            if (sec === '0') {
                sec = '';
            } else {
                sec = `\`${sec}\`초 `
            }
            if (min === '0') {
                min = '';
            } else {
                min = `\`${min}\`분 `
            }
            if (hrs === '0') {
                hrs = '';
            } else {
                hrs = `\`${hrs}\`시간 `
            }
            if (day === '0') {
                day = '';
            } else {
                day = `\`${day}\`일 `
            }
            if(wek === '0') {
                wek = '';
            } else {
                wek = `\`${wek}\`주`
            }
            return `마지막 빌드를 기준으로 ${wek}${day}${hrs}${min}${sec}가동 중이에요! `
        }
        return message.channel.send(duration(bot.uptime))
    }
}

module.exports.help = {
    name: "업타임",
    aliases: [''],
    category: "",
    description: ""
}