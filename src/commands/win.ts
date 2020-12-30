import editJsonFile from 'edit-json-file';

const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;
const setTier = require('../index').setTier;

const name = 'win';
const usage = `${PREFIX}${name} [@winner] to [@loser]`;

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;
	const file = editJsonFile(`${__dirname}/../../data.json`);

	const mentions = message.mentions.users.array();
	const winner = mentions[0];
	const loser = mentions[1];

	if (args.length <= 1 || winner == undefined || loser == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}

	if (file.get(`data.${winner}`) == undefined)
		setup(winner, message);
	if (file.get(`data.${loser}`) == undefined)
		setup(loser, message);

	const winnerScore = file.get(`data.${winner}.score`);
	const loserScore = file.get(`data.${loser}.score`);

	if (winnerScore == loserScore) {
		winlose(winner, loser, 25, message);
	} else if (winnerScore < loserScore) {
		winlose(winner, loser, 30, message);
	} else { // winnerScore > loserScore
		winlose(winner, loser, 20, message);
	}
}

const setup = (who: any, message: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`);
	file.set(`data.${who}.username`, who.username);
	file.set(`data.${who}.score`, 0);
	file.set(`data.${who}.tier`, TIER[setTier(file.get(`data.${who}.score`))]);
	file.set(`data.${who}.win`, 0);
	file.set(`data.${who}.lose`, 0);
	file.set(`data.${who}.Odds`, 0);
	file.save();
}

const win = (winner: any, point: number, message: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`);
	file.set(`data.${winner}.score`, file.get(`data.${winner}.score`) + point);
	file.set(`data.${winner}.win`, file.get(`data.${winner}.win`) + 1);
	message.channel.send(`${winner.username}님이 점수를 얻었습니다! ${file.get(`data.${winner}.score`)}점(+${point})`);
	if (file.get(`data.${winner}.tier`) != TIER[setTier(file.get(`data.${winner}.score`))]) {
		message.channel.send(`${winner.username}님이 승급하였습니다!\n${file.get(`data.${winner}.tier`)} => ${TIER[setTier(file.get(`data.${winner}.score`))]}`);
		file.set(`data.${winner}.tier`, TIER[setTier(file.get(`data.${winner}.score`))]);
	}
	file.set(`data.${winner}.Odds`, (file.get(`data.${winner}.win`) / (file.get(`data.${winner}.win`) + file.get(`data.${winner}.lose`))) * 100);
	file.save();
}
const lose = (loser: any, point: number, message: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`);
	if ((file.get(`data.${loser}.score`) - point) <= 0)
		file.set(`data.${loser}.score`, 0);
	else
		file.set(`data.${loser}.score`, file.get(`data.${loser}.score`) - point);
	file.set(`data.${loser}.lose`, file.get(`data.${loser}.lose`) + 1);
	message.channel.send(`${loser.username}님이 점수를 잃었습니다.. ${file.get(`data.${loser}.score`)}점(-${point})`);
	if (file.get(`data.${loser}.tier`) != TIER[setTier(file.get(`data.${loser}.score`))]) {
		message.channel.send(`저런! ${loser.username}님의 등급이 내려갔습니다.\n${file.get(`data.${loser}.tier`)} => ${TIER[setTier(file.get(`data.${loser}.score`))]}`);
		file.set(`data.${loser}.tier`, TIER[setTier(file.get(`data.${loser}.score`))]);
	}
	file.set(`data.${loser}.Odds`, (file.get(`data.${loser}.win`) / (file.get(`data.${loser}.win`) + file.get(`data.${loser}.lose`))) * 100);

	file.save();
}
const winlose = (winner: any, loser: any, point: number, message: any) => {
	win(winner, point, message);
	lose(loser, point, message);
}

exports.name = name;