import editJsonFile from 'edit-json-file';

const MASTER = require('../../option.json').MASTER;
const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;

const name = 'rank';
const usage = `${PREFIX}${name}`

exports.run = (client: any, message: any, args: any) => {
	if (MASTER.indexOf(message.author.id) == -1) return;

	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });
	if (message.author.username == 'White_Choco') {
		const role = message.guild.roles.cache.find((role: any) => role.name === "BRONZE");
		if (role) {
			message.guild.members.cache.get(message.author.id).roles.add(role);
		} else {
			message.channel.send('Not Found that Role');
		}
	} else {
		message.channel.send('Failed');
	}
}

// exports.name = name;