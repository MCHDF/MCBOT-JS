const ping = require('minecraft-server-util');
const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (message.guild.id != '534586842079821824') {
            return message.channel.send('이거 여기서 쓰는게 아닐텐데요...');
        }

        if (!args[0]) {
            return message.channel.send(`:bulb: \`${prefix}서버 카운터, ${prefix}서버 시즈니스\``)
        }

        // 버튼으로 다시 리메이크하기에는 다른 임베드 메시지 전부 바꿔야 한다는 점에 불가능했다...
        if (args[0] === '카운터') {
            let embed = new MessageEmbed()
                .setTimestamp()
                .setColor('YELLOW')
                .setTitle('CounterOnline Server Status')
                .setDescription('정보를 불러오는 중입니다!')
            let msg = await message.channel.send({ embed: embed });

            ping('zbcounter.net', 25565, (error, response) => {
                if (error) {
                    let embed = new MessageEmbed()
                        .setTitle('CounterOnline Server Status')
                        .setDescription('서버가 멈췄거나 꺼진것 같아요...')
                        .setColor('#ff0000')
                        .setTimestamp()
                    msg.edit({ embed: embed });
                }
                let embed = new MessageEmbed()
                    .setTitle('CounterOnline Server Status')
                    .setThumbnail('https://api.mcsrvstat.us/icon/zbcounter.net')
                    .addField('서버 버전', response.version)
                    .addField('온라인', response.onlinePlayers + "명")
                    .addField('최대 플레이어', response.maxPlayers + "명")
                    .setColor('#00ff2b')
                    .setTimestamp()
                msg.edit({ embed: embed });
            })
        } else if (args[0] === '시즈니스') {
            let embed = new MessageEmbed()
                .setTimestamp()
                .setColor('YELLOW')
                .setTitle('Sizniss Server Status')
                .setDescription('정보를 불러오는 중입니다!')
            let msg = await message.channel.send({ embed: embed });
            ping('sizniss.kr', 25565, (error, response) => {
                if (error) {
                    let embed = new MessageEmbed()
                        .setTitle('Sizniss Server Status')
                        .setDescription('서버가 멈췄거나 꺼진것 같아요...')
                        .setColor('#ff0000')
                        .setTimestamp()
                    msg.edit({ embed: embed });
                }
                let embed = new MessageEmbed()
                    .setTitle('Sizniss Server Status')
                    .setThumbnail('https://api.mcsrvstat.us/icon/sizniss.kr')
                    .addField('서버 버전', response.version)
                    .addField('온라인', response.onlinePlayers + "명")
                    .addField('최대 플레이어', response.maxPlayers + "명")
                    .setColor('#00ff2b')
                    .setTimestamp()
                msg.edit({ embed: embed });
            })
        }
    }
}

module.exports.help = {
    name: "서버",
    aliases: [''],
    category: "",
    description: ""
}