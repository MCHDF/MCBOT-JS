
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if(message.author.id != (await bot.fetchApplication()).owner.id) {
            message.channel.send('ACCESS_DENIED');
        } else {
            if(!args[0]){
                return message.channel.send('비활성화할 파일의 이름을 적어주세요!');
            }
            let commandName = args[0];

            try {
                delete require.cache[require.resolve(`./${commandName}.js`)]
                bot.commands.delete(commandName)
            } catch (e) {
                return message.channel.send(`비활성화 불가 : \`${commandName}\`\n\`\`\`${e}\`\`\``)
            }
            message.channel.send(`파일 \`${commandName}\` 비활성화 완료`)
        }
    }
}

module.exports.help = {
    name: "MCunload",
    aliases: [''],
    category: "",
    description: ""
}