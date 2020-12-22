
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if(message.author.id != (await bot.fetchApplication()).owner.id) {
            message.channel.send('ACCESS_DENIED');
        } else {
            if(args[0] === 'bot') {
                await message.channel.send('봇을 재시작합니다.');
                process.exit();
            }
            if(!args[0]){
                return message.channel.send('다시 로드할 파일의 이름을 적어주세요!');
            }
            let commandName = args[0];

            try {
                delete require.cache[require.resolve(`./${commandName}.js`)]
                bot.commands.delete(commandName)
                const pull = require(`./${commandName}.js`)
                bot.commands.set(pull.help.name, pull)
            } catch (e) {
                return message.channel.send(`리로드 불가 : \`${commandName}.js\`\n\`\`\`${e}\`\`\``)
            }
            message.channel.send(`파일 리로드 : \`${commandName}.js\``)
        }
    }
}

module.exports.help = {
    name: "MCreload",
    aliases: [''],
    category: "",
    description: ""
}