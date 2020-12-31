import Discord from 'discord.js';
import editJsonFile from 'edit-json-file';

const PREFIX = require('../../option.json').PREFIX;

const name = 'userstats';
const usage = `${PREFIX}${name} [@mention]`;

exports.run = (client: any, message: any, args: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`, { stringify_width: 4 });

	const who = message.mentions.users.first();
	if (who == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}
	if (who == null) {
		message.channel.send(`There is an issue what 'userstats' command don't catch users who joined this server after made this command.\nWill fix as fast as possible. Thank you.`);
	}

	const tier = file.get(`data.${who}.tier`);
	const tierAttachment: any = new Discord.MessageAttachment(`./src/tierImages/${tier}.png`, `${tier}.png`);
	const statsEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`${who.username}'s Stats`)
		.setAuthor(`${who.tag}`, `${who.displayAvatarURL()}`)
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