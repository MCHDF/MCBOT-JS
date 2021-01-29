const Canvas = require('canvas');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { join } = require('path');

module.exports.run = async (bot, message, args, con) => {
    // if(message.guild.id === '534586842079821824') {
    //     return message.channel.send('해당 서버는 XP기능이 제한되어있습니다. 사용을 자제해주세요.');
    // }

    const member = message.mentions.users.first() || message.author;
    
    let embed = new MessageEmbed()
    .setTitle(`XP - ${member.username}`)
    .setColor("YELLOW")
    .setDescription('불러오는 중...')
    let msg = await message.channel.send(embed);

    const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: "png", size: 1024 }));
    const background = await Canvas.loadImage(join(__dirname, "..", "imgs", "xp_bg.png"));
    con.query(`select * from xp where guildId = '${message.guild.id}' order by lvl DESC, xp DESC;`, (err, rows) => {
        if (err) throw err;

        if (!rows[0]) return message.channel.send(':x: XP가 기록되어있지 않습니다! 채팅을 한번이라도 해주세요!');
        let i = 0;
        let rank = 1;
        var xp = rows[0].xp;
        var lvl = rows[0].lvl;
        while (member.id != rows[i].id) {
            rank += 1;
            i+=1;
            xp = rows[i].xp;
            lvl = rows[i].lvl;
        }

        function fontFile(name) {
            return join(__dirname, '../fonts/NanumBarunGothic.ttf')
        }

        const canvas = Canvas.createCanvas(1000, 333);
        const ctx = canvas.getContext('2d');
        Canvas.registerFont(fontFile('../fonts/NanumBarunGothic.ttf'), { family: 'Nanum' });
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.linewidth = 1;
        ctx.strokeStyle = "#FFFFFF";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#2f2f2f"
        ctx.fillRect(310, 216, 600, 65);
        ctx.fill();
        ctx.strokeRect(310, 216, 600, 65);
        ctx.stroke();
        
        ctx.fillStyle = '#4d4d4d';
        ctx.globalAlpha = 1;
        ctx.fillRect(310, 216, ((100 / (lvl * 300)) * xp) * 6, 65);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = '30px NanumBarunGothic';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        var n = (xp / (lvl * 300) * 100);
        ctx.fillText(`${xp} / ${lvl * 300} XP (${n.toFixed(1)}%)`, 600, 260);

        ctx.textAlign = 'left';
        ctx.fillText(member.tag, 310, 120);
        if (rank <= 99) {
            
            ctx.font = "80px NanumBarunGothic";
            ctx.textAlign = 'left';
            if (rank === 1){
                rank += 'st';
                ctx.fillStyle = '#c6a15b';
            }
            else if (rank === 2) {
                rank += 'nd';
                ctx.fillStyle = '#848c8e';
            }
            else if (rank === 3) {
                rank += 'rd';
                ctx.fillStyle = '#b2675e';
            }
            else{
                rank += 'th';
                ctx.fillStyle = '#e6e8e6';
            }
            ctx.fillText('#' + rank, 770, 95);

            ctx.font = "30px NanumBarunGothic";
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText('RANK', 690, 60);

        } else if (rank >= 100) {

            rank += 'th';

            ctx.font = "80px NanumBarunGothic";
            ctx.fillStyle = '#e6e8e6';
            ctx.textAlign = 'left';
            ctx.fillText('#' + rank, 720, 95);
    
            ctx.font = "30px NanumBarunGothic";
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText('RANK', 640, 60);
        }

        ctx.font = "50px NanumBarunGothic";
        ctx.fillText('Lv. ', 308, 180);
        ctx.fillText(lvl, 375, 180);

        ctx.arc(170, 160, 120, 0, Math.PI * 2, true);
        ctx.linewidth = 6;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 45, 40, 245, 245);
        //ctx.drawImage(avatar, x, y, width, height);

        const attachment = new MessageAttachment(canvas.toBuffer(), `${message.guild.name}_${member.tag}_rank.png`);
        msg.delete();
        message.channel.send(attachment);
    });
}

module.exports.help = {
    name: "xp",
    aliases: ['경험치', 'exp'],
    category: "xp",
    description: "funny xp system"
}