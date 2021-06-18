const { MessageEmbed } = require("discord.js");
const log = require('../config/logger.js')
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!args[0]) {
            let embed = new MessageEmbed()
                .setTitle("BlackJack")
                .setDescription('미니게임 - 블랙잭을 이용하기위한 명령어입니다.')
                .setColor('GREEN')
                .addField(`[ ${prefix}블랙잭 룰 ]`, "블랙잭에 대한 기본 규칙을 표시합니다.", true)
                .addField(`[ ${prefix}블랙잭 베팅 <금액(최소 500원)> ]`, "지정한 금액을 베팅하여 블랙잭을 시작합니다.", true)
            return message.channel.send(embed);
        } else if (args[0] === '베팅') {
            if (isNaN(args[1]) || parseInt(args[1]) === 0) {
                return message.reply(":octagonal_sign: 제가 잘못 본건가요....?")
            }
            if (isNaN(args[1]) || parseInt(args[1]) < 0) {
                return message.reply(":octagonal_sign: 베팅액을 적어주세요...!")
            }
            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                if (!rows[0]) {
                    return message.channel.send('유저분은 현재 MCBOT Economy 정보를 작성하지 않으셨습니다.\n:bulb: \`!돈 기본지급\`');
                }
                let money = rows[0].money;
                let user = rows[0].userId;
                let betMoney = parseInt(args[1]);

                if (args[1] < 500) {
                    return message.reply(":octagonal_sign: 최소 베팅 금액은 500원입니다...!")
                } else if (args[1] > money) {
                    return message.reply(":octagonal_sign: 돈이 부족하신 것 같아요...!")
                } else if (money < 500) {
                    return message.reply(":octagonal_sign: 돈이 부족하신 것 같아요...!")
                }

                let playerCard1 = Math.floor(Math.random() * 10) + 2;
                let playerCard2 = Math.floor(Math.random() * 10) + 2;
                let botCard1 = Math.floor(Math.random() * 10) + 2;
                let botCard2 = Math.floor(Math.random() * 10) + 2;
                let botCard3;
                let playerTotal = playerCard1 + playerCard2;
                let playerArray = [];
                let botArray = [];
                playerArray.push(playerCard1);
                playerArray.push(playerCard2);
                botArray.push(botCard1);
                botArray.push(botCard2);

                let embed = new MessageEmbed()
                    .setTitle('BlackJack')
                    .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                    .setDescription('원하시는 제스쳐를 클릭해주세요!')
                    .addField('[ 당신의 손 ]', `${playerArray}`, true)
                    .addField('[ 당신의 총합 ]', `${playerTotal}`, true)
                    .addField('\u200B', '\u200B', true)
                    .addField('[ 봇의 손 ]', `?? ${botCard2}`, true)
                    .addField('[ 봇의 총합 ]', `??`, true)
                    .addField('\u200B', '\u200B', true)

                message.channel.send({ embed: embed }).then(msg => {
                    msg.react('👇').then(r => {
                        msg.react('🤚').then(r => {
                            msg.react('✌').then(r => {
                                msg.react('❎')

                                const standFilter = (reaction, user) =>
                                    reaction.emoji.name === "🤚" && user.id === message.author.id;
                                const hitFilter = (reaction, user) =>
                                    reaction.emoji.name === "👇" && user.id === message.author.id;
                                const doubleFilter = (reaction, user) =>
                                    reaction.emoji.name === "✌" && user.id === message.author.id;
                                const surrenderFilter = (reaction, user) =>
                                    reaction.emoji.name === "❎" && user.id === message.author.id;
                                const double = msg.createReactionCollector(doubleFilter, {
                                    time: 60000,
                                    max: 1
                                });
                                const stand = msg.createReactionCollector(standFilter, {
                                    time: 60000,
                                    max: 1
                                });
                                const hit = msg.createReactionCollector(hitFilter, {
                                    time: 60000,
                                });
                                const surrender = msg.createReactionCollector(surrenderFilter, {
                                    time: 60000,
                                    max: 1
                                });
                                let sum1 = playerArray.reduce(function (a, b) {
                                    return a + b;
                                }, 0);
                                let playerCount;
                                playerCount = sum1;
                                let sum2 = botArray.reduce(function (a, b) {
                                    return a + b;
                                }, 0);
                                let botCount;
                                botCount = sum2;
                                if (playerCount > 21) {
                                    con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                    let result = new MessageEmbed()
                                        .setTitle('BlackJack')
                                        .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                        .setDescription(`Busrt! -${betMoney.toLocaleString()}`)
                                        .setColor('RED')
                                        .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                        .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                        .addField('[ 봇의 손 ]', `${botArray}`, true)
                                        .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                    msg.edit({ embed: result });
                                    log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                    hit.stop();
                                    stand.stop();
                                    surrender.stop();
                                    double.stop();
                                    msg.reactions.removeAll();
                                } else if (playerCount === 21) {
                                    con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                    let result = new MessageEmbed()
                                        .setTitle('BlackJack')
                                        .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                        .setDescription(`BlackJack! +${(betMoney * 1.5).toLocaleString()}`)
                                        .setColor('GREEN')
                                        .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                        .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                        .addField('[ 봇의 손 ]', `${botArray}`, true)
                                        .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                    msg.edit({ embed: result });
                                    con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                        let money = rows[0].money;
                                        con.query(`UPDATE Economy SET money = ${money + (betMoney * 1.5)} WHERE userId = '${user}';`);
                                    })
                                    log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 1.5).toLocaleString()}원 획득`)
                                    hit.stop();
                                    stand.stop();
                                    surrender.stop();
                                    double.stop();
                                    msg.reactions.removeAll();
                                } else if (botCount === 21) {
                                    con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                    let result = new MessageEmbed()
                                        .setTitle('BlackJack')
                                        .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                        .setDescription(`Dealer BlackJack! -${betMoney.toLocaleString()}`)
                                        .setColor('RED')
                                        .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                        .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                        .addField('[ 봇의 손 ]', `${botArray}`, true)
                                        .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                    msg.edit({ embed: result });
                                    log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                    hit.stop();
                                    stand.stop();
                                    surrender.stop();
                                    double.stop();
                                    msg.reactions.removeAll();
                                } else if (playerCount === 21 && botCount === 21) {
                                    con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                    let result = new MessageEmbed()
                                        .setTitle('BlackJack')
                                        .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                        .setDescription(`Push 베팅 금액 회수!`)
                                        .setColor('GREEN')
                                        .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                        .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                        .addField('[ 봇의 손 ]', `${botArray}`, true)
                                        .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                    msg.edit({ embed: result });
                                    con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                        let money = rows[0].money;
                                        con.query(`UPDATE Economy SET money = ${money + betMoney} WHERE userId = '${user}';`);
                                    })
                                    log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 무승부`)
                                    hit.stop();
                                    stand.stop();
                                    surrender.stop();
                                    double.stop();
                                    msg.reactions.removeAll();
                                }
                                // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────//
                                stand.on("collect", r => {
                                    let sum1 = playerArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let playerCount;
                                    playerCount = sum1;
                                    let sum2 = botArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let botCount;
                                    botCount = sum2;
                                    while (botCount < 16) {
                                        botCard3 = Math.floor(Math.random() * 10) + 2;
                                        botArray.push(botCard3);
                                        sum2 = botArray.reduce(function (a, b) {
                                            return a + b;
                                        }, 0);
                                        botCount = sum2;
                                    }
                                    if (playerCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Busrt -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                        hit.stop();
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (botCount === 21 && playerCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (botCount === 21 && playerCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                        hit.stop();
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount === 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Push 베팅 금액 회수!`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + betMoney} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 무승부`)
                                        hit.stop();
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === botCount && playerCount < 21 && botCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Push 베팅 금액 회수!`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + betMoney} WHERE userId = '${user}';`);
                                        })
                                        hit.stop();
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 무승부`)
                                        stand.stop()
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount < 21) {
                                        if (playerCount > botCount) {
                                            con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                            let result = new MessageEmbed()
                                                .setTitle('BlackJack')
                                                .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                                .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                                .setColor('GREEN')
                                                .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                                .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .addField('[ 봇의 손 ]', `${botArray}`, true)
                                                .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                            msg.edit({ embed: result });
                                            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                                let money = rows[0].money;
                                                con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                            })
                                            log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                            hit.stop();
                                            stand.stop();
                                            surrender.stop();
                                            double.stop();
                                            msg.reactions.removeAll();
                                        } else if (playerCount < botCount && botCount < 21) {
                                            con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                            let result = new MessageEmbed()
                                                .setTitle('BlackJack')
                                                .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                                .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                                .setColor('RED')
                                                .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                                .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .addField('[ 봇의 손 ]', `${botArray}`, true)
                                                .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                            msg.edit({ embed: result });
                                            log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                            hit.stop();
                                            stand.stop();
                                            surrender.stop();
                                            double.stop();
                                            msg.reactions.removeAll();
                                        } else if (playerCount < botCount && botCount > 21) {
                                            con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                            let result = new MessageEmbed()
                                                .setTitle('BlackJack')
                                                .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                                .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                                .setColor('GREEN')
                                                .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                                .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .addField('[ 봇의 손 ]', `${botArray}`, true)
                                                .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                            msg.edit({ embed: result });
                                            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                                let money = rows[0].money;
                                                con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                            })
                                            log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                            hit.stop();
                                            stand.stop();
                                            surrender.stop();
                                            double.stop();
                                            msg.reactions.removeAll();
                                        }
                                    }
                                })
                                // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────//                            
                                hit.on("collect", r => {
                                    msg.reactions.resolve('✌').users.remove('706171196701540384');

                                    let playerCard3 = Math.floor(Math.random() * 10) + 2;
                                    playerArray.push(playerCard3);
                                    let sum1 = playerArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let playerCount;
                                    playerCount = sum1;
                                    let sum2 = botArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let botCount;
                                    botCount = sum2;
                                    if (botCount <= 16) {
                                        botCard3 = Math.floor(Math.random() * 10) + 2;
                                        botArray.push(botCard3);
                                        sum2 = botArray.reduce(function (a, b) {
                                            return a + b;
                                        }, 0);
                                        botCount = sum2;
                                    }

                                    if (playerCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Busrt -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (botCount === 21 && playerCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (botCount === 21 && playerCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount === 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Push 베팅 금액 회수!`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + betMoney} WHERE userId = '${user}';`);
                                        })
                                        hit.stop();
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 무승부`)
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else {
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray} ${playerCard3}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `?? ${botCard2} ??`, true)
                                            .addField('[ 봇의 총합 ]', `??`, true)
                                            .addField('\u200B', '\u200B', true)
                                        msg.edit({ embed: result });
                                    }
                                })
                                // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────//
                                double.on('collect', r => {
                                    betMoney = betMoney * 2;
                                    if (money < betMoney) {
                                        let result = new MessageEmbed()
                                            .setTitle('금액 부족!')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setColor('RED')
                                            .addField('[ 잔액 ]', `${money.toLocaleString()}`, true)
                                            .setFooter(`더블 다운에 필요한 돈 : ${betMoney.toLocaleString()}`)
                                        msg.reactions.removeAll();
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        return msg.edit({ embed: result });
                                    }
                                    let playerCard3 = Math.floor(Math.random() * 10) + 2;
                                    playerArray.push(playerCard3);
                                    let sum1 = playerArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let playerCount;
                                    playerCount = sum1;
                                    let sum2 = botArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let botCount;
                                    botCount = sum2;
                                    if (botCount <= 16) {
                                        botCard3 = Math.floor(Math.random() * 10) + 2;
                                        botArray.push(botCard3);
                                        sum2 = botArray.reduce(function (a, b) {
                                            return a + b;
                                        }, 0);
                                        botCount = sum2;
                                    }
                                    if (playerCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Busrt -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (botCount === 21 && playerCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (botCount === 21 && playerCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                            .setColor('RED')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount > 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === 21 && botCount === 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Push 베팅 금액 회수!`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + betMoney} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 무승부`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount === botCount && playerCount < 21 && botCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        let result = new MessageEmbed()
                                            .setTitle('BlackJack')
                                            .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                            .setDescription(`Push 베팅 금액 회수!`)
                                            .setColor('GREEN')
                                            .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                            .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .addField('[ 봇의 손 ]', `${botArray}`, true)
                                            .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                            .addField('\u200B', '\u200B', true)
                                            .setFooter('Double Down!')
                                        msg.edit({ embed: result });
                                        con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                            let money = rows[0].money;
                                            con.query(`UPDATE Economy SET money = ${money + betMoney} WHERE userId = '${user}';`);
                                        })
                                        log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 무승부`)
                                        hit.stop();
                                        stand.stop();
                                        surrender.stop();
                                        double.stop();
                                        msg.reactions.removeAll();
                                    } else if (playerCount < 21) {
                                        con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                        if (playerCount > botCount) {
                                            let result = new MessageEmbed()
                                                .setTitle('BlackJack')
                                                .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                                .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                                .setColor('GREEN')
                                                .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                                .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .addField('[ 봇의 손 ]', `${botArray}`, true)
                                                .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .setFooter('Double Down!')
                                            msg.edit({ embed: result });
                                            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                                let money = rows[0].money;
                                                con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                            })
                                            log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                            hit.stop();
                                            stand.stop();
                                            surrender.stop();
                                            double.stop();
                                            msg.reactions.removeAll();
                                        } else if (playerCount < botCount && botCount < 21) {
                                            con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                            let result = new MessageEmbed()
                                                .setTitle('BlackJack')
                                                .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                                .setDescription(`Dealer Win! -${betMoney.toLocaleString()}`)
                                                .setColor('RED')
                                                .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                                .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .addField('[ 봇의 손 ]', `${botArray}`, true)
                                                .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .setFooter('Double Down!')
                                            msg.edit({ embed: result });
                                            log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${betMoney.toLocaleString()}원 손실`)
                                            hit.stop();
                                            stand.stop();
                                            surrender.stop();
                                            double.stop();
                                            msg.reactions.removeAll();
                                        } else if (playerCount < botCount && botCount > 21) {
                                            con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                            let result = new MessageEmbed()
                                                .setTitle('BlackJack')
                                                .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                                .setDescription(`You Win! +${(betMoney * 2).toLocaleString()}`)
                                                .setColor('GREEN')
                                                .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                                .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .addField('[ 봇의 손 ]', `${botArray}`, true)
                                                .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                                .addField('\u200B', '\u200B', true)
                                                .setFooter('Double Down!')
                                            msg.edit({ embed: result });
                                            con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                                let money = rows[0].money;
                                                con.query(`UPDATE Economy SET money = ${money + (betMoney * 2)} WHERE userId = '${user}';`);
                                            })
                                            log.info(`BlackJack >> ${message.author.username}님이 ${betMoney.toLocaleString()}원 베팅하여 ${(betMoney * 2).toLocaleString()}원 획득`)
                                            hit.stop();
                                            stand.stop();
                                            surrender.stop();
                                            double.stop();
                                            msg.reactions.removeAll();
                                        }
                                    }
                                })
                                // ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────//
                                surrender.on('collect', r => {
                                    let sum1 = playerArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let playerCount;
                                    playerCount = sum1;
                                    let sum2 = botArray.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    let botCount;
                                    botCount = sum2;
                                    con.query(`UPDATE Economy SET money = ${money - betMoney} WHERE userId = '${user}';`);
                                    let result = new MessageEmbed()
                                        .setTitle('BlackJack')
                                        .setAuthor(`도전자 - ${message.author.username}`, message.author.avatarURL({ size: 2048 }))
                                        .setDescription(`Surrender! 베팅 금액의 반 회수!`)
                                        .setColor('RED')
                                        .addField('[ 당신의 손 ]', `${playerArray}`, true)
                                        .addField('[ 당신의 총합 ]', `${playerCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                        .addField('[ 봇의 손 ]', `${botArray}`, true)
                                        .addField('[ 봇의 총합 ]', `${botCount}`, true)
                                        .addField('\u200B', '\u200B', true)
                                    msg.edit({ embed: result });
                                    con.query(`SELECT * FROM Economy WHERE userId = '${message.author.id}'`, (err, rows) => {
                                        let money = rows[0].money;
                                        con.query(`UPDATE Economy SET money = ${(money + (betMoney / 2))} WHERE userId = '${user}';`);
                                    })
                                    hit.stop();
                                    stand.stop();
                                    surrender.stop();
                                    double.stop();
                                    msg.reactions.removeAll();
                                })
                            })
                        })
                    })
                })
            })
        } else if (args[0] === '룰') {
            let embed = new MessageEmbed()
                .setTitle('MCBOT BlackJack')
                .setColor('#FFE4E4')
                .setDescription('도박 게임인 블랙잭에 대한 설명입니다!\n도박에 대해서 잘 아는게 없다보니 구현되지 못한 부분도 많습니다..그래도 재미있게 즐겨주시면 감사하겠습니다!\n\n블랙잭은 게임 시작과 동시에 2개의 카드를 받은 후, 숫자 21에 가까운 사람이 이기는 게임입니다.\n숫자는 21을 넘어가서는 안되며, 숫자가 작을경우에는 카드를 더 받아올 수 있습니다.\n(코드 구조의 문제로 A의 숫자는 11로 고정되어있습니다. 또한 K, Q, J은 숫자 10으로 표기되어있습니다.)')
                .addField('[ 👇 Hit ]', '\`\`\`히트는 카드를 한장 더 받아옵니다. 카드는 랜덤으로 받아오며, 당연히 숫자 21을 넘기지 않도록 조심해야합니다. 히트를 하신후, 다시한번 히트를 하실 경우에는 히트 반응을 다시 누르시면됩니다!\`\`\`')
                .addField('[ ✋ Stay ]', '\`\`\`스테이는 현재 가진 카드로 승부를 봅니다! 스테이 선택 이후에는 봇의 히트 또는 스테이가 이어지고, 결과가 표시됩니다.\`\`\`')
                .addField('[ ✌ Double Down ]', '\`\`\`더블 다운은 게임 시작 후 처음에만 사용할 수 있으며, 한번의 히트와 함께 베팅 금액을 두배로 걸고 턴을 끝냅니다.\`\`\`')
                .addField('[ ❎ Surrender ]', '\`\`\`서렌더는 말 그대로 항복을 뜻하며, 어떤 숫자가 나오던, 베팅 금액의 절반을 받으며 게임을 끝냅니다.\`\`\`')

                .setFooter("[ 문의 ] : MCHDF#9999")

            return message.channel.send({ embed: embed });
        }
    }
}


module.exports.help = {
    name: "블랙잭",
    aliases: ['ㅠㅓ', 'bj', 'qmfforwor'],
    category: "",
    description: ""
}