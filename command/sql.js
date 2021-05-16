
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (message.author.id != (await bot.fetchApplication()).owner.id) {
            message.channel.send('ACCESS_DENIED');
        }
    }
}

module.exports.help = {
    name: "sql",
    aliases: [''],
    category: "",
    description: ""
}