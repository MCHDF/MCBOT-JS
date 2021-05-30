var cheerio = require('cheerio');
var request = require('request');

const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (bot, message, args, con, prefix) => {
        if (!args[0]) {
            return message.channel.send(`:bulb: \`\`${prefix}날씨 <행정구역이름>\`\``)
        } else {

            var todaytemp = new Array(),
                cast_txt = new Array(),
                sensible = new Array(),
                min = new Array(),
                max = new Array(),
                rainfall = new Array();

            let url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=';
            for (var j = 0; j < args.length; j++) {
                url += `${encodeURI(args.slice(0).join(" "))}`;
            }

            url += encodeURI('날씨');

            let waitEmbed = new MessageEmbed()
                .setTitle(`${args.slice(0).join(" ")} 날씨`)
                .setTimestamp()
                .setFooter('검색 엔진 : NAVER')
                .setDescription('오늘 하루 예상 날씨 정보를 불러오고있어요...조금만 기다려주세요!')
                .setColor("YELLOW");
            const msg = await message.channel.send(waitEmbed);

            request(url, function (err, res, html) {
                if (err) throw err;

                if (!err) {
                    var $ = cheerio.load(html);
                    for (i = 0; i < 1; i++) {
                        $('.info_temperature > .todaytemp').each(function () {
                            var todaytemp_info = $(this);
                            todaytemp_info = todaytemp_info.text();
                            todaytemp[i] = todaytemp_info;
                            i++;
                        })
                    }
                    for (i = 0; i < 1; i++) {
                        $('.cast_txt').each(function () {
                            var cast_txt_info = $(this);
                            cast_txt_info = cast_txt_info.text();
                            cast_txt[i] = cast_txt_info;
                            i++;
                        })
                    }
                    $('.sensible > em > .num').each(function () {
                        var sensible_info = $(this);
                        sensible = sensible_info.text();
                    })
                    $('.merge > .min > .num').each(function () {
                        var min_info = $(this);
                        min = min_info.text();
                    })
                    $('.merge > .max > .num').each(function () {
                        var max_info = $(this);
                        max = max_info.text();
                    })
                    $('.rainfall > em > .num').each(function () {
                        var rainfall_info = $(this);
                        rainfall = rainfall_info.text();
                    })

                    if (todaytemp[0] === undefined) {
                        let embed = new MessageEmbed()
                            .setTitle(`검색 결과 없음`)
                            .setTimestamp()
                            .setFooter('날씨 정보 출처 : NAVER')
                            .setDescription('검색결과가 존재하지 않습니다.')
                            .setColor("RED")
                        msg.edit(embed);
                    } else {
                        let embed = new MessageEmbed()
                            .setTitle(`${args.slice(0).join(" ")} 날씨`)
                            .setTimestamp()
                            .setFooter('검색 엔진 : NAVER • 발표 : 기상청\n제공 : 웨더아이')
                            .setDescription('오늘 하루 예상 날씨를 표시합니다!\n\n(네이버 검색 결과를 기준으로 표시하고있습니다.)')
                            .setColor("#81DCFF")
                            .addField('날씨 상황', `${cast_txt[0]}`)
                            .addField('현재 온도', `${todaytemp[0]}℃`, true)
                            .addField('체감 온도', `${sensible}˚`, true)
                            .addField('예상 온도', `${min}˚ / ${max}˚`, true)
                        if (rainfall === '') {
                            msg.edit(embed);
                            return
                        } else {
                            embed
                                .addField('시간당 강수량', `${rainfall}mm`)
                            msg.edit(embed);
                            return
                        }
                    }
                }
            });
        }
    }
}

module.exports.help = {
    name: "날씨",
    aliases: [''],
    category: "",
    description: ""
}