import Discord from 'discord.js';
import editJsonFile from 'edit-json-file';

const name = 'stats';

exports.run = (client: any, message: any, args: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`, { stringify_width: 4 });

	const tier = file.get(`data.${message.author.id}.tier`);
	const tierAttachment: any = new Discord.MessageAttachment(`./src/tierImages/${tier}.png`, `${tier}.png`);
	const statsEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`${message.author.username}'s Stats`)
		.setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
		.setTimestamp()
		.setFooter('MORDHAU Stats');
	if (file.get(`data.${message.author.id}`) == undefined) {
		statsEmbed.addField(`Not Found.`, `Stats of **${message.author.username}** are not found.`);
	} else {
		statsEmbed.attachFiles(tierAttachment)
			.setThumbnail(`attachment://${tier}.png`)
			.addFields(
				{ name: 'Score', value: file.get(`data.${message.author.id}.score`), inline: true },
				{ name: 'Tier', value: file.get(`data.${message.author.id}.tier`), inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'win', value: file.get(`data.${message.author.id}.win`), inline: true },
				{ name: 'lose', value: file.get(`data.${message.author.id}.lose`), inline: true },
				{ name: 'Odds', value: `${file.get(`data.${message.author.id}.Odds`).toFixed(2)}%`, inline: true },
			);
	}
	message.channel.send(statsEmbed);
}
exports.name = name;