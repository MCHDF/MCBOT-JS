const { MessageEmbed, MessageAttachment } = require("discord.js");
const { inspect } = require("util");
const { Type } = require('@extreme_hero/deeptype')

module.exports = {
    run: async (bot, message, args, con, prefix) => {

        if (message.author.id != (await bot.fetchApplication()).owner.id) {
            return message.channel.send('ACCESS_DENIED');
        }

        if (!args[0]) {
            return message.channel.send('어.....네?');
        } else if (args[0].includes("con")) {
            if (message.author.id != (await bot.fetchApplication()).owner.id) {
                return message.channel.send("데이터베이스 접근 금지");
            }
        }
        let code = args.join(' ');
        let evaled;
        code = code.replace(/[""]/g, '"').replace(/['']/g, "'");
        try {
            const start = process.hrtime();
            evaled = eval(code);
            if (evaled instanceof Promise) {
                evaled = await evaled;
            }
            const stop = process.hrtime(start);
            let OUT = clean(inspect(evaled, { depth: 0 }));
            let type = new Type(evaled).is;
            let Time = ((stop[0] * 1e9) + stop[1]) / 1e6;
            let respone = [
                '**OUT**', `\`\`\`js\n ${OUT}\n\`\`\``,
                '**Type**', `\`\`\`ts\n${type}\n\`\`\``,
                '**Time**', `\`\`\`${Time}ms\`\`\``
            ];
            const res = respone.join('\n');
            if (res.length < 2000) {
                let evalPrint = new MessageEmbed()
                    .setTitle('EVAL')
                    .addField('**OUT**', `\`\`\`js\n ${OUT}\n\`\`\``)
                    .addField('**Type**', `\`\`\`ts\n${type}\n\`\`\``)
                    .addField('**Time**', `\`\`\`${Time}ms\`\`\``)
                    .setColor('GREEN')
                    .setTimestamp()
                await message.channel.send(evalPrint);
            } else {
                const output = new MessageAttachment(Buffer.from(res), 'output.txt');
                await message.channel.send(output);
            }
        } catch (e) {
            return message.channel.send(`\`\`\`x1\n${clean(e)}\n\`\`\``);
        }
        function clean(text) {
            if (typeof text === 'string') {
                text = text
                    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                    .replace(/@/g, `@${String.fromCharCode(8203)}`)
                    .replace(new RegExp(bot.token, 'gi'), '****');
            }
            return text;
        }
    }
}

module.exports.help = {
    name: "eval",
    aliases: [''],
    category: "",
    description: ""
}