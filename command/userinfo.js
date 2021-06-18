const { MessageEmbed } = require("discord.js");
const dateFormat = require('dateformat');

module.exports = {
    run: (bot, message, args) => {
        let user = message.mentions.users.first() || message.author;

        if (user.presence.status === "dnd") user.presence.status = "방해 금지"
        if (user.presence.status === "idle") user.presence.status = "AFK"
        if (user.presence.status === "offline") user.presence.status = "오프라인"
        if (user.presence.status === "online") user.presence.status = "온라인"

        const member = message.guild.member(user);

        let createdate = dateFormat(user.createdAt, 'yyyy.mm.dd');
        let joindate = dateFormat(member.joinedAt, 'yyyy.mm.dd');
        let status = user.presence.status;
        let avatar = user.avatarURL({ size: 2048 });

        let embed = new MessageEmbed()
            .setAuthor(`${user.tag}`, avatar)
            .setColor('#ffc4c4')
            .setTimestamp()
            .setThumbnail(avatar)
            .setFooter(message.guild.name)
            .addField('[ 유저 이름 ]', user.username, true)
            .addField('[ 유저 태그 ]', user.tag, true)
            .addField('[ 유저 ID ]', user.id, true)
            .addField('[ 서버 가입일 ]', joindate, true)
            .addField('[ 계정 생성일 ]', createdate, true)
            .addField('[ 유저 상태 ]', `**${status}**`, true);
        message.channel.send({ embed: embed });
    }
}

module.exports.help = {
    name: "유저",
    aliases: ['user', '유저'],
    category: "Information",
    description: "Information for guild Members"
}

