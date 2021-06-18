const { MessageEmbed } = require("discord.js");

module.exports = {
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete();
        }
        if (!message.author.id === (await bot.fetchApplication()).owner.id) {
            return message.channel.send(':no_mouth:')
        }
        if (args.length < 1) {
            return message.channel.send('아무말도 안하시는 건가요...?').then(m => m.delete({ timeout: 3000 }));
        }
        let roleColor = message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "임베드") {
            let embed = new MessageEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "));
            return message.channel.send({ embed: embed });
        } else {
            return message.channel.send(args.join(" "));
        }
    }
}

module.exports.help = {
    name: "say",
    aliases: ['age'],
    category: "",
    description: ""
}