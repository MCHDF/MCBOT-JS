module.exports = {
    run: async (bot, msg, args) => {
        
        const message = await msg.channel.send('🏓 공을 토스해서 서버의 리시브를 기다리고있어요...');

        message.edit(`🏓 리시브를 받았어요!\n메세지 핑 : ${Math.floor(message.createdTimestamp - msg.createdTimestamp)}ms\nAPI 핑 : ${Math.round(bot.ws.ping)}ms`);
    }
}

module.exports.help = {
    name: "핑",
    aliases: ['핑'],
    category: "",
    description: "Pinging to Server"
}