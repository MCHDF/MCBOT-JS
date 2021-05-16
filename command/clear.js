module.exports = {
    run: async (bot, message, args) => {
        //수리완료
        if (message.deletable) {
            message.delete();
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply(":octagonal_sign: 권한이 없어요!")
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply(":exclamation: 이 명령어는 숫자만 인식해요! 숫자를 입력해주세요!")
        }

        if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
            return message.reply(":exclamation: 저에게 메시지 관리 권한이 부여되지 않았어요!\n권한을 부여한 후에 다시 시도해주세요!")
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.reply(`:white_check_mark: 메시지 \`${deleted.size}\`개를 삭제했어요!`).then(m => m.delete({ timeout: 3000 })))
            .catch(err => message.reply(`:exclamation: 앗, 처리 도중에 문제가 생겼어요!\n\`\`\`${err}\`\`\``));
    }
}

module.exports.help = {
    name: "clear",
    aliases: ['청소', 'cls'],
    category: "moderation",
    description: "Clear Chat"
}