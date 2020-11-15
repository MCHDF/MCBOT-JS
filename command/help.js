const { MessageEmbed } = require('discord.js');
module.exports = {
    run: async (bot, message, args, con, prefix) => {
        let embed = new MessageEmbed()
            .setTitle("**명령어 도움말**")
            .setColor("#FFE4E4")
            .setAuthor("MCBOT", "https://i.imgur.com/Togof5u.png")
            .setThumbnail("https://i.imgur.com/Togof5u.png")
            .setDescription('모든 명령어는 ' + prefix + ' 를 붙여 사용합니다.')
            .setFooter(`Request by ${message.guild.name} • 문의 : MCHDF#9999`);
        if (args[0] === '일반') {

            embed
                // 일반 명령어 설명
                .addField("🏓 Ping! Pong! 🏓", "```서버와 클라이언트 간의 지연시간을 알아봅니다.\n사용법 : " + prefix + "핑```")
                .addField("❗ 경고 ❗", "```경고 기능에 대한 도움말을 표시해요!\n사용법 : " + prefix + "경고```")
                .addField("사랑...💖", "```유저분들 사랑해요!\n사용법 : " + prefix + "love```")
                .addField("🌤 날씨 ⛈", "```우리나라 행정구역의 날씨 정보를 보여줘요! (띄어쓰기하면 안되요...ㅠ)\n사용법 : " + prefix + "날씨 <행정구역>```")
                .addField("😀 유저", "```멘션된 유저의 정보를 불러와요!\n사용법 : " + prefix + "유저 <mentions>\n기본값 : 자기 자신```")
                .addField("⏱ UpTime", "```제가 가동된 시간을 알려드려요!\n사용법 : " + prefix + "업타임```")
                .addField("🙃 about", "```제가 이야기 할 수 있는 저의 정보를 모두 표시해드려요!\n사용법 : " + prefix + "about```")
            if (message.guild.id === '703807451325268088') {
                embed
                    .addField("서버 상태", "```카운터 온라인 서버와 시즈니스 서버의 상태를 확인합니다!\n사용법 : " + prefix + "서버```")
            }
        } else if (args[0] === '미니게임') {
            embed
                // 미니게임 명령어 설명
                .addField('\u200B', '**미니게임**')
                .addField('🏆 Ranking 🏆', '```미니게임의 XP 랭킹을 알아봅니다!\n사용법 : ' + prefix + '랭킹```')
                .addField('💰 Economy', '```이코노미 관련 정보를 알려드려요!\n사용법 : ' + prefix + 'eco```')
                .addField('🖐, ✌, 👊', '```미니게임 - 가위바위보를 시작합니다!\n사용법 : ' + prefix + 'rps```')
                .addField("🎲 XP 🎲", "```현재 자신의 경험치를 표시해줘요!\n사용법 : " + prefix + "xp <유저 멘션>\n기본값 : 자기 자신```")
                .addField('♠ BlackJack ♥', '```미니게임 - 블랙잭의 도움말을 표시합니다.\n사용법 : ' + prefix + '블랙잭```')
        } else if (args[0] === '도구') {

            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.reply(":octagonal_sign: 운영자 명령어를 확인하기 위해선, 관리자 권한이 필요해요!")
            }
            embed
                .setDescription('모든 관리 명령어는 관리자 권한이 필요해요!')
                .addField('\u200B', '**운영자 전용 명령어**')
                .addField("✂ 채팅 청소", "```입력한 값만큼의 채팅을 정리합니다! 최소 2개, 최대 100개 까지, 14일 이전의 메시지만 가능해요!\n사용법 : " + prefix + "clear <number>```")
                .addField("접두사 설정", "```서버에서 사용할 봇의 접두사를 설정 할수 있어요!\n(음악 명령어는 적용되지 않아요!)\n사용법 : " + prefix + "prefix <바꿀 접두사 | 초기화>\n기본값 : !\n현재값 : " + prefix + "```")
                .addField("필터링 제외", "```명령어를 사용한 채널에 욕설 필터링을 제외시켜요!\n한 채널에만 가능해요!\n사용법 : " + prefix + "필터제외```")
                .addField("멤버 카운트", "```서버의 멤버 카운트 채널을 관리해요!!\n한 채널(음성)에만 가능해요!\n사용법 : " + prefix + "카운트```")
                .addField("📜 로그", "```명령어를 사용한 채널에 갖가지 로그를 띄우도록 설정해요!\n한 채널에만 가능해요!\n사용법 : " + prefix + "로그```")
                .addField("자동역할", "```서버에 가입했을때 자동으로 부여할 역할을 설정해요!\n사용법 : " + prefix + "자동역할 <역할멘션>```")
                .addField("자동역할 취소", "```자동역할 부여를 취소해요!\n사용법 : " + prefix + "자동역할 취소```")
        } else if (!args[0]) {
            embed
                // 일반 명령어 설명
                .addField('**일반**', "```일반적으로 사용 할 수있는 명령어를 표시해요!!\n사용법 : " + prefix + "help 일반```")
                // 음악 명령어 설명
                .addField('🎶 **음악**', "```음악봇 사용에 관한 도움말을 표시해요!\n사용법 : " + prefix + "mhelp```")
                // 미니게임 명령어 설명
                .addField('🎲 **미니게임**', "```권한이 필요한 운영자 전용 도움말을 표시해요!\n사용법 : " + prefix + "help 미니게임```")
                // 권한이 필요한 모더레이터 전용 명령어 설명
                .addField('👮‍♂️ **운영자 전용 명령어**', "```권한이 필요한 운영자 전용 도움말을 표시해요!\n사용법 : " + prefix + "help 도구```")
        }
        message.fetch(message.id).then(m => {
            m.react("📜");
        });
        return message.author.send(embed);
    }
}

module.exports.help = {
    name: "help",
    aliases: ['도움말', 'h'],
    category: "",
    description: "Help for MCBOT what have commands"
}