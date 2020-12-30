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
	const file = editJsonFile(`${__dirname}/../../data.json`, { stringify_width: 4 });

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
		console.log(`initUsers called!!!`);
	}

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

const win = (winner: any, point: number, message: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`, { stringify_width: 4 });
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
	const file = editJsonFile(`${__dirname}/../../data.json`, { stringify_width: 4 });
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