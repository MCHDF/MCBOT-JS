const { MessageEmbed } = require("discord.js");
const beautify = require('beautify');

module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!args[0]) {
            return message.channel.send('어.....네?');
        }
        try {
            if (args.join(' ').toLowerCase().includes("token")) {
                return;
            }

            const toEval = args.join(' ');
            const evaluated = eval(toEval);

            let embed = new MessageEmbed()
                .setColor('GREEN')
                .setFooter(bot.user.username, bot.user.displayAvatarURL())
                .addField('구문', `\`\`\`js\n${beautify(args.join(' '), { format: "js" })}\n\`\`\``)
                .addField('결과', evaluated)
                .addField('결과 유형', typeof (evaluated))

            return message.channel.send(embed);
        } catch (e) {
            return message.channel.send(`\`\`\`${e}\`\`\``)
        }

    }
}

module.exports.help = {
    name: "e",
    aliases: [''],
    category: "",
    description: ""
}