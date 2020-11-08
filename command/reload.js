
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if(message.author.id != '468781931182555136') {
            message.channel.send('ACCESS_DENIED');
        } else {
            if(!args[0]){
                return message.channel.send('재시작할 파일의 이름을 적어주세요!');
            }
            let commandName = args[0];

            try {
                delete require.cache[require.resolve(`./${commandName}.js`)]
                bot.commands.delete(commandName)
                const pull = require(`./${commandName}.js`)
                bot.commands.set(pull.help.name, pull)
            } catch (e) {
                return message.channel.send(`재시작 불가 : \`${commandName}\`\n\`\`\`${e}\`\`\``)
            }
            message.channel.send(`파일 \`${commandName}\` 재시작 완료`)
        }
    }
}

module.exports.help = {
    name: "MCreload",
    aliases: [''],
    category: "",
    description: ""
}