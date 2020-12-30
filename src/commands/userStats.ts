import Discord from 'discord.js';
import editJsonFile from 'edit-json-file';

const PREFIX = require('../../option.json').PREFIX;

const name = 'userstats';
const usage = `${PREFIX}${name} [@mention]`;

exports.run = (client: any, message: any, args: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`);

	const who = message.mentions.users.first();
	if (who == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}

	const tier = file.get(`data.${who}.tier`);
	const tierAttachment: any = new Discord.MessageAttachment(`./src/tierImages/${tier}.png`, `${tier}.png`);
	const statsEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`${who.username}'s Stats`)
		.setAuthor(`${who.tag}`, `${who.avatarURL()}`)
		.setTimestamp()
		.setFooter('MORDHAU Stats');
	if (file.get(`data.${who}`) == undefined) {
		statsEmbed.addField(`Not Found.`, `Stats of **${who.username}** are not found.`);
	} else {
		statsEmbed.attachFiles(tierAttachment)
			.setThumbnail(`attachment://${tier}.png`)
			.addFields(
				{ name: 'Score', value: file.get(`data.${who}.score`), inline: true },
				{ name: 'Tier', value: file.get(`data.${who}.tier`), inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'win', value: file.get(`data.${who}.win`), inline: true },
				{ name: 'lose', value: file.get(`data.${who}.lose`), inline: true },
				{ name: 'Odds', value: `${file.get(`data.${who}.Odds`).toFixed(2)}%`, inline: true },
			);
	}
	message.channel.send(statsEmbed);
}
exports.name = name;