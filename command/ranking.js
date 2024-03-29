const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, con, prefix) => {
    
    if (!args[0]) {
        return message.channel.send(`:bulb: \`${prefix}랭킹 <돈, xp>\``)
    }
    if (args[0] === "xp") {
        let embed = new MessageEmbed()
            .setTitle('[ XP - 랭킹 Top10 ]')
            .setTimestamp()
            .setColor('YELLOW')
            .setDescription(`현재 서버 **${message.guild.name}** 의 XP랭킹 정보를 불러오고 있습니다!`)
        let rankEmbed = await message.channel.send({ embed: embed })

        con.query(`SELECT * FROM xp WHERE guildId = '${message.guild.id}' ORDER BY lvl DESC, xp DESC LIMIT 10;`, (err, rows) => {
            let embed = new MessageEmbed()
                .setTitle('[ XP - 랭킹 Top10 ]')
                .setTimestamp()
                .setThumbnail(message.guild.iconURL())
                .setFooter(message.guild.name)

            if (rows.length === 0) {
                embed
                    .setColor('RED')
                    .addField('데이터를 불러오지 못했거나, 오류가 생긴것 같아요!');
                rankEmbed.edit({ embed: embed });
            } else if (rows.length < 10) {
                embed
                    .setColor('#6481BD')
                for (i = 0; i < rows.length; i++) {
                    let xp = rows[i].xp;
                    let lvl = rows[i].lvl;
                    let name = rows[i].name;
                    var n = (xp / (lvl * 300) * 100);
                    embed
                        .addField(`**[ ${i + 1}위 ] ${name}**`, `[ Level ] : ${lvl}\n[ XP ] : ${xp} / ${lvl * 300}\n[ 달성도 ] : ${n.toFixed(1)}%`, true)
                }
                rankEmbed.edit({ embed: embed });
            } else {
                embed
                    .setColor('#6481BD')
                for (i = 0; i < 10; i++) {
                    let xp = rows[i].xp;
                    let lvl = rows[i].lvl;
                    let name = rows[i].name;
                    var n = (xp / (lvl * 300) * 100);
                    embed
                        .addField(`**[ ${i + 1}위 ] ${name}**`, `[ Level ] : ${lvl}\n[ XP ] : ${xp} / ${lvl * 300} \n[ 달성도 ] : ${n.toFixed(1)}%`, true)
                }
                rankEmbed.edit({ embed: embed });
            }
        });

    } else if (args[0] === '돈') {
        con.query(`SELECT * FROM Economy ORDER BY money DESC, name ASC LIMIT 10;`, (err, rows) => {
            let embed = new MessageEmbed()
                .setTitle('[ Economy 랭킹 Top10 ]')
                .setTimestamp()

            if (rows.length === 0) {
                embed
                    .setColor('RED')
                    .addField('데이터를 불러오지 못했거나, 오류가 생긴것 같아요!');
            } else if (rows.length < 10) {
                embed
                    .setColor('GREEN')
                for (i = 0; i < rows.length; i++) {
                    let money = rows[i].money;
                    let name = rows[i].name;
                    embed
                        .addField(`**[ ${i + 1}위 ] \`${name}\`**`, `[ 잔액 ] : ${money.toLocaleString()}`, true)
                }
            } else {
                embed
                    .setColor('GREEN')
                for (i = 0; i < 10; i++) {
                    let money = rows[i].money;
                    let name = rows[i].name;
                    embed
                        .addField(`**[ ${i + 1}위 ] \`${name}\`**`, `[ 잔액 ] : ${money.toLocaleString()}`, true)
                }
            }
            message.channel.send({ embed: embed });
        });
    }

}

module.exports.help = {
    name: "랭킹",
    aliases: [],
    category: "xp",
    description: "funny xp system"
}