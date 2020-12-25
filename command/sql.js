
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if(message.author.id != '468781931182555136') {
            message.channel.send('ACCESS_DENIED');
        } else {
            con.query(`쿼리내용`);
            return message.channel.send('완료')
        }
    }
}

module.exports.help = {
    name: "sql",
    aliases: [''],
    category: "",
    description: ""
}