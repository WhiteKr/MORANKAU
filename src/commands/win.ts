import Discord from 'discord.js';
import editJsonFile from 'edit-json-file';

const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;
const setTier = require('./exportsFuntions').setTier;
const initUsers = require('./exportsFuntions').initUsers;

const name = 'win';
const usage = `${PREFIX}${name} [@winner] to [@loser]`;

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;
	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });

	const mentions = message.mentions.users.array();
	const winner = mentions[0];
	const loser = mentions[1];

	if (args.length <= 1 || winner == undefined || loser == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}

	let arr: any = [];
	if (file.get(`data.${winner}`) == undefined || file.get(`data.${loser}`) == undefined) {
		if (file.get(`data.${winner}`) == undefined)
			arr.push(winner);
		if (file.get(`data.${loser}`) == undefined)
			arr.push(loser);
		initUsers(arr);
	}

	if (winner == undefined || loser == undefined) {
		message.channel.send(`사용법: ${usage}`);
	}

	const winnerTier = file.get(`data.${winner}.tier`);
	const loserTier = file.get(`data.${loser}.tier`);

	let repeatTime = 1;
	if (args[5] != undefined && args[5].match(/times?/i)) {
		if (args[4].match(/[^0-9]+/g)) {
			message.channel.send(`사용법: \`${usage}\``);
		} else {
			repeatTime = args[4];
		}
	}
	winlose(winner, loser, message, repeatTime);
}
exports.name = name;

function setPointByTierGap(winnerTier: any, loserTier: any) {
	const winnerTierIndex = TIER.indexOf(winnerTier);
	const loserTierIndex = TIER.indexOf(loserTier);

	const basicPoint = 25;
	const tierGap = winnerTierIndex - loserTierIndex;
	let point = Math.round(basicPoint * (1 + (0.2 * -tierGap)));
	if (point < 1) point = 1;
	if (point > 50) point = 50;

	return point;
}

function win(winner: any, point: any) {
	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });

	file.set(`data.${winner}.score`, file.get(`data.${winner}.score`) + point);
	file.set(`data.${winner}.win`, file.get(`data.${winner}.win`) + 1);
	if (file.get(`data.${winner}.tier`) != TIER[setTier(file.get(`data.${winner}.score`))]) {
		file.set(`data.${winner}.tier`, TIER[setTier(file.get(`data.${winner}.score`))]);
	}
	file.set(`data.${winner}.Odds`, (file.get(`data.${winner}.win`) / (file.get(`data.${winner}.win`) + file.get(`data.${winner}.lose`))) * 100);
	file.save();
	return point;
}

function lose(loser: any, point: any) {
	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });

	file.set(`data.${loser}.score`, file.get(`data.${loser}.score`) - point);
	if (file.get(`data.${loser}.score`) <= 0)
		file.set(`data.${loser}.score`, 0);
	file.set(`data.${loser}.lose`, file.get(`data.${loser}.lose`) + 1);
	if (file.get(`data.${loser}.tier`) != TIER[setTier(file.get(`data.${loser}.score`))]) {
		file.set(`data.${loser}.tier`, TIER[setTier(file.get(`data.${loser}.score`))]);
	}
	file.set(`data.${loser}.Odds`, (file.get(`data.${loser}.win`) / (file.get(`data.${loser}.win`) + file.get(`data.${loser}.lose`))) * 100);
	file.save();
	return point;
}

function winlose(winner: any, loser: any, message: any, repeatTime: number) {
	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });
	const winnerBeforeTier = file.get(`data.${winner}.tier`);
	const loserBeforeTier = file.get(`data.${loser}.tier`);

	let winnerTotalPoint = 0;
	let loserTotalPoint = 0;

	if (repeatTime == undefined) {
		repeatTime = 1;
	}
	for (let i = 0; i < repeatTime; i++) {
		const file = editJsonFile(`../../data.json`, { stringify_width: 4 });
		const point = setPointByTierGap(file.get(`data.${winner}.tier`), file.get(`data.${loser}.tier`));
		winnerTotalPoint += win(winner, point);
		loserTotalPoint += lose(loser, point);

		if (i == repeatTime - 1) {
			let embedTitle = 'Result of Match';
			if (repeatTime != 1)
				embedTitle += 'es';
			const winloseEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(embedTitle)
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL());
			let winnerEmbedText = `Points Increased to ${file.get(`data.${winner}.score`)}(+${winnerTotalPoint}).`;
			if (winnerBeforeTier != TIER[setTier(file.get(`data.${winner}.score`))])
				winnerEmbedText += `\nTier Promoted to ${TIER[setTier(file.get(`data.${winner}.score`))]} (was ${winnerBeforeTier}).`;
			winloseEmbed.addField(
				`${winner.tag}`,
				winnerEmbedText,
				false
			);
			let loserEmbedText = `Point Decreased to ${file.get(`data.${loser}.score`)}(-${loserTotalPoint}).`;
			if (loserBeforeTier != TIER[setTier(file.get(`data.${loser}.score`))])
				`\nTier Demoted to ${TIER[setTier(file.get(`data.${loser}.score`))]} (was ${loserBeforeTier}).`;
			winloseEmbed.addField(
				`${loser.tag}`,
				loserEmbedText,
				false
			);
			message.channel.send(winloseEmbed);
		}
	}
}