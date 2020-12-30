import editJsonFile from 'edit-json-file';

const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;
const setTier = require('../index').setTier;

const name = 'pointUp';
const usage = `${PREFIX}${name} [@mention]`;

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;
	const file = editJsonFile(`${__dirname}/../../data.json`);

	const to = message.mentions.users.first();

	if (args.length <= 1 || to == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}

	if (file.get(`data.${to}`) == undefined) {
		file.set(`data.${to}.score`, 0);
		file.set(`data.${to}.tier`, TIER[0]);
		file.set(`data.${to}.win`, 0);
		file.set(`data.${to}.lose`, 0);
		file.set(`data.${to}.Odds`, 0);
	}

	const point = 25;
	file.set(`data.${to}.username`, `${to.username}`);
	file.set(`data.${to}.score`, file.get(`data.${to}.score`) + point);
	message.channel.send(`점수가 올랐습니다. ${file.get(`data.${to}.score`)}점(+${point})`);
	if (file.get(`data.${to}.tier`) != TIER[setTier(file.get(`data.${to}.score`))]) {
		message.channel.send(`축하합니다. 승급하였습니다!\n${file.get(`data.${to}.tier`)} => ${TIER[setTier(file.get(`data.${to}.score`))]}`);
		file.set(`data.${to}.tier`, TIER[setTier(file.get(`data.${to}.score`))]);
	}
	file.set(`data.${to}.win`, file.get(`data.${to}.win`) + 1);
	file.set(`data.${to}.Odds`, (file.get(`data.${to}.win`) / (file.get(`data.${to}.win`) + file.get(`data.${to}.lose`))) * 100);

	file.save();
}
exports.name = name;