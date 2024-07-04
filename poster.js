const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token} = require ('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname,'commands');
const commandFolders = fs.readdirSync(foldersPath);

/*
- so this should just have postIt and stopq. 
- stopq is then its only actual interaction, yeah?

*/

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
//https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.each(createJSON) //runs on ready in case servers were added while offline
});



client.on(Events.InteractionCreate, async interaction => {
	if (interaction.customId = 'stopq'){

    }
});

client.login(token);

function postIt(servNo) {
    //logger(servNo);
    let adminChannel = servers[servNo].adm;
    let targetChannel = servers[servNo].targ;
    let jsonName = servers[servNo].id + '.json';
    //logger(adminChannel);
    time = (new Date()).toLocaleString()
    try {
        var file = fs.readFileSync(jsonName)
        commands = JSON.parse(file);
        //postIt(id);
    } catch (er) {
        logger(time)
        logger(er)
    }


    const embed = {
        "color": 16312092,
        "description": `Got an idea for question of the day? \nWe'd love to hear it 😃 \n[*Drop off the suggestion here!*](${process.env.SUGGESTION_LINK})`
    };
    if (0 < Object.keys(commands).length) {
        if (!!commands["0"]) {
            var question = commands["0"];
            deleteQ(servNo, "0",Object.keys(commands).length, commands, jsonName);
        }
        logger(time+` ${question} - from `+client.guilds.cache.get(servers[servNo].id).toString())
        client.channels.cache.get(targetChannel).send({content:`${question}`, embeds: [embed] });
    } else { logger(time+" - No Q loaded on server: " + client.guilds.cache.get(servers[servNo].id).toString())}
    //logger(servNo); - 86400000 is one day
    servers[servNo].instance = setTimeout(() => { postIt(servNo) }, 86400000)
}