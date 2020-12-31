const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;
const setTier = require('./exportsFuntions').setTier;
const initUsers = require('./exportsFuntions').initUsers;

const name = 'init';
const usage = `${PREFIX}${name} ([@mentions...] | @everyone)`;

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;
	let mentions = message.mentions.users.array();
	if (mentions.length == 0 || mentions == undefined) {
		message.channel.send(`사용법: \`${usage}\``);
		return;
	}
	initUsers(mentions);
	if (mentions.length >= 10) {
		const sliceMention = mentions.slice(0, 10);
		const moreMentionCnt = mentions.length - sliceMention.length;
		message.channel.send(`Stats of **${sliceMention.join('**, **')}** and ${moreMentionCnt} users are successfully Reseted.`);
	} else {
		message.channel.send(`Stats of **${mentions.join('**, **')}** are successfully Reseted.`);
	}
}
exports.name = name;