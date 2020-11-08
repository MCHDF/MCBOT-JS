module.exports = {
    run: async (bot, msg, args) => {
        
        const message = await msg.channel.send('🏓 공을 토스해서 서버의 리시브를 기다리고있어요...');

        message.edit(`🏓 리시브를 받았어요!\n걸린 시간 : ${Math.floor(message.createdAt - msg.createdAt)}ms`)
    }
}

module.exports.help = {
    name: "핑",
    aliases: ['핑'],
    category: "",
    description: "Pinging to Server"
}