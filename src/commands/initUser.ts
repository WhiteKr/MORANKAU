import editJsonFile from 'edit-json-file';

const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;
const setTier = require('../index').setTier;

const name = 'init';
const usage = `${PREFIX}${name} [@mention]`;

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;

	const who = message.mentions.users.first();
	if (who == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}

	const file = editJsonFile(`${__dirname}/../../data.json`);
	file.set(`data.${who}.username`, who.username);
	file.set(`data.${who}.score`, 0);
	file.set(`data.${who}.tier`, TIER[setTier(file.get(`data.${who}.score`))]);
	file.set(`data.${who}.win`, 0);
	file.set(`data.${who}.lose`, 0);
	file.set(`data.${who}.Odds`, 0);
	file.save();
}
exports.name = name;