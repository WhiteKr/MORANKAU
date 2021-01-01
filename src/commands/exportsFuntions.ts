import editJsonFile from 'edit-json-file';

const TIER = require('../../option.json').TIER;

exports.setTier = (score: number) => {
	var res = 0;
	if (score >= 0)
		res = (score / 100) | 0;
	if (res >= TIER.length)
		res = TIER.length - 1;
	return res;
}

exports.initUsers = (whos: Array<any>) => {
	const setTier = require('./exportsFuntions').setTier;
	const file = editJsonFile(`../../data.json`, { stringify_width: 4 });
	for (let i = 0; i < whos.length; i++) {
		file.set(`data.${whos[i]}.username`, whos[i].username);
		file.set(`data.${whos[i]}.score`, 200);
		file.set(`data.${whos[i]}.tier`, TIER[setTier(file.get(`data.${whos[i]}.score`))]);
		file.set(`data.${whos[i]}.win`, 0);
		file.set(`data.${whos[i]}.lose`, 0);
		file.set(`data.${whos[i]}.Odds`, 0);
		file.save();
	}
}