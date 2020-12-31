import editJsonFile from 'edit-json-file';

const PREFIX = require('../../option.json').PREFIX;
const TIER = require('../../option.json').TIER;

const name = 'gap';
const usage = `${PREFIX}${name} [@winner] [@loser]`;

exports.run = (client: any, message: any, args: any) => {
	const file = editJsonFile(`${__dirname}/../../data.json`, { stringify_width: 4 });

	const mentions = message.mentions.users.array();
	const winner = mentions[0];
	const loser = mentions[1];

	if (winner == undefined || loser == undefined) {
		message.channel.send(`사용법: ${usage}`);	
	}

	const winnerTier = file.get(`data.${winner}.tier`);
	const loserTier = file.get(`data.${loser}.tier`);
	const winnerTierIndex = TIER.indexOf(winnerTier);
	const loserTierIndex = TIER.indexOf(loserTier);

	const basicPoint = 25;
	const tierGap = winnerTierIndex - loserTierIndex;
	let point = Math.round(basicPoint * (1 + (0.2 * (tierGap * -1))));
	if (point < 1) point = 1;
	if (point > 50) point = 50;

	message.channel.send(`${point} points`);
}
// exports.name = name;