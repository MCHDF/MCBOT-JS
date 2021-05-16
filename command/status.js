const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    run: async (bot, message, args, prefix, con) => {
        let mem = 'http://localhost:61208/api/3/mem'
        let cpuapi = 'http://localhost:61208/api/3/cpu'
        let uptime = 'https://localhost:61208/api/3/uptime'
        let embed = new MessageEmbed()
            .setTitle(`${bot.user.username} System Status [Test]`)
            .setTimestamp()
            .setColor("YELLOW")
            .setDescription('시스템 상태를 불러오는 중입니다...')
        let msg = await message.channel.send(embed);
        let result = new MessageEmbed()
            .setTitle(`${bot.user.username} System Status [Test]`)
            .setTimestamp()
            .setColor("GREEN")

        request(uptime, async function (err, res, body) {
            if (err) return message.channel.send(`\`\`\`${err}\`\`\``);
            var time = JSON.parse(body)
            await result
                .setDescription(`${time}`)
            msg.edit(result);
        })

        request(cpuapi, async function (err, res, body) {
            if (err) return message.channel.send(`\`\`\`${err}\`\`\``);
            await cpu(body, result)
            msg.edit(result);
        })

        request(mem, async function (err, res, body) {
            if (err) return message.channel.send(`\`\`\`${err}\`\`\``);
            await memory(body, result);
            msg.edit(result);
        })
    }
}

function memory(body, embed) {
    var memory = JSON.parse(body);
    var free = formatByteSizeString(memory.free);
    var percent = memory.percent;
    var used = formatByteSizeString(memory.used);
    var cached = formatByteSizeString(memory.cached);
    var total = formatByteSizeString(memory.total);
    return embed
        .addField('[ Memory ]', `전체 : ${total}\n여유 : ${free}\n캐시됨 : ${cached}\n사용(Byte) : ${used}\n사용(%) : ${percent}%`, true)
}

function cpu(body, embed) {
    var cpu = JSON.parse(body);
    var system = cpu.system;
    var idle = cpu.idle;
    var total = cpu.total;
    var user = cpu.user;
    var cpucore = cpu.cpucore
    return embed
        .addField('[ CPU ]', `코어 : ${cpucore}\nidle : ${idle}%\n전체 사용률 : ${total}%\n시스템 : ${system}%\n유저 : ${user}%`, true)
}

function formatByteSizeString(bytes, decimals = 2) {
    if (bytes == 0) {
        return '0 Byte';
    }

    const k = 1024;
    const dm = decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

module.exports.help = {
    name: "status",
    aliases: ['상태'],
    category: "",
    description: ""
}