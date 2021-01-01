import editJsonFile from 'edit-json-file';

const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;
const setTier = require('./exportsFuntions').setTier;
const initUsers = require('./exportsFuntions').initUsers;

const name = 'pointdown';
const usage = `${PREFIX}${name} [@mention]`;

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;
	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });

	const mentions = message.mentions.users.array();
	const who = mentions[0];
	console.log(`mentions: ${mentions}\nwho: ${who.tag}`);

	if (args.length <= 1 || who == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}
	if (file.get(`data.${who}`) == undefined) {
		initUsers(mentions);
	}

	const whoFile = file.get(`data.${who}`);
	console.log(`whofile: ${whoFile}`);

	const point = 25;
	file.set(`data.${who}.username`, `${who.username}`);
	if (file.get(`data.${who}.score`) > 0)
		file.set(`data.${who}.score`, file.get(`data.${who}.score`) - point);
	message.channel.send(`점수가 떨어졌습니다. ${file.get(`data.${who}.score`)}점(-${point})`);
	if (file.get(`data.${who}.tier`) != TIER[setTier(file.get(`data.${who}.score`))]) {
		message.channel.send(`저런, 등급이 떨어졌습니다.\n${file.get(`data.${who}.tier`)} => ${TIER[setTier(file.get(`data.${who}.score`))]}`);
		file.set(`data.${who}.tier`, TIER[setTier(file.get(`data.${who}.score`))]);
	}
	file.set(`data.${who}.lose`, file.get(`data.${who}.lose`) + 1);
	file.set(`data.${who}.Odds`, (file.get(`data.${who}.win`) / (file.get(`data.${who}.win`) + file.get(`data.${who}.lose`))) * 100);
	file.save();
}
// exports.name = name;