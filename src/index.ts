import Discord from 'discord.js';
const client = new Discord.Client();
import fs from 'fs';

const TOKEN = require('../option.json').TOKEN;
const PREFIX = require('../option.json').PREFIX;

function requireUncached(module: any) {
	delete require.cache[require.resolve(module)];
	return require(module);
}

const commands: any = new Discord.Collection();
commands.load = (dir: any) => {
	for (const file of fs.readdirSync(dir)) {
		requireUncached(`./commands/${file}`);
		const cmd = require(`./commands/${file}`);
		commands.set(cmd.name, cmd);
	}
	// console.log(commands.map((c: any) => c.name).join(', ') + ' 명령어가 로드됨.');
}

// on message
client.on('message', (message: any) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;

	commands.load(__dirname + "/commands");

	const args = message.content.slice(PREFIX.length).trim().split(/ +/g); // !명령어 어쩌구 저쩌구 
	const command = args[0];

	let cmd = commands.get(command);
	//get는 컬렉션 내에 해당 key 값을 가진 데이터가 없으면 false 값을 반환하므로 부분적으로 Collection#has처럼 사용할수 있습니다.

	if (cmd) {
		if (message.channel.type == 'dm') {
			console.log(`\n${message.author.tag} in ${message.channel.name} (DM)\n  ${message.content}\n`);
		} else {
			console.log(`\n${message.author.tag} in ${message.channel.name} of ${message.guild.name}\n  ${message.content}\n`);
		}
		cmd.run(client, message, args);
	}
});

// login
client.login(TOKEN).then(() => {
	console.log('봇이 준비되었습니다');
	console.log('Logging in...');
	client.user?.setActivity('전원 켜지는 중...', { type: 'PLAYING' });
});

// on ready
client.on('ready', () => {
	const activities_list = [
		`${client.user?.username}봇의 접두사는 ${PREFIX} 입니다`,
		`MORDHAU는 세기의 갓-겜입니다.`,
		`어드민만 사용할 수 있는 명령어가 있습니다.`,
		`오류나 건의 사항은 White_Choco#9170으로.`
	];
	let index = 0;
	console.log(`Logged in as ${client.user?.tag}!`);
	setInterval(() => {
		client.user?.setActivity(activities_list[index]);
		if (index == activities_list.length - 1)
			index = 0;
		else
			index++;
	}, 6000);
});

exports.setTier = (score: number) => {
	const TIER = require('../option.json').TIER;
	var res = 0;
	if (score >= 0)
		res = (score / 100) | 0;
	if (res >= TIER.length)
		res = TIER.length - 1;
	return res;
}