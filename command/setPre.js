const fs = require('fs');

module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(':octagonal_sign: 권한이 없어요!');
        }
        if (args[0] === '초기화') {
            let prefixSet = JSON.parse(fs.readFileSync('./jsons/prefixSet.json', 'utf-8'));

            prefixSet[message.guild.id] = {
                prefixSet: '!'
            };
            fs.writeFile('./jsons/prefixSet.json', JSON.stringify(prefixSet), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    return message.channel.send(`:arrows_counterclockwise: 접두사 초기화가 완료되었어요!\n바뀐 접두사 : \`!\``);
                }
            });
        } else {
            if (!args[0]) {
                return message.channel.send(`:bulb: 접두사 설정은 이렇게 해요! \`${prefix}prefix <바꿀 접두사>\`\n:bulb: 현재 접두사 : \`${prefix}\`\n(음악 명령어에는 적용되지않아요!)`);
            }
            let prefixSet = JSON.parse(fs.readFileSync('./jsons/prefixSet.json', 'utf-8'));

            prefixSet[message.guild.id] = {
                prefixSet: args[0]
            };

            fs.writeFile('./jsons/prefixSet.json', JSON.stringify(prefixSet), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    return message.channel.send(`:white_check_mark: 접두사 변경이 완료되었어요!\n바뀐 접두사 : \`${args[0]}\``);
                }
            });
        }
    }
}

module.exports.help = {
    name: "prefix",
    aliases: ['s'],
    category: "",
    description: ""
}