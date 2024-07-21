
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

module.exports ={ postIt(servNo, client) {
	poster(servNo,instance,client)
}}

function poster(servNo,client){
let jsonName = servNo+'cfg.json'
	let adminChannel
	let targetChannel
	let rolePing
	time = (new Date()).toLocaleString()
	try{
		var file = fs.readFileSync(jsonName);
		serverConfig = JSON.parse(file)
		console.log(serverConfig)
		adminChannel = serverConfig.admChannel
		targetChannel = serverConfig.targChannel
		if (serverConfig.rolePing) { rolePing = serverConfig.rolePing }

        commands = JSON.parse(file);

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

        qContent = (rolePing) ? rolePing + question : question;


        client.channels.cache.get(targetChannel).send({content: qContent, embeds: [embed] });
    } else { logger(time+" - No Q loaded on server: " + client.guilds.cache.get(servers[servNo].id).toString())}
    //logger(servNo); - 86400000 is one day
    setTimeout(() => { poster(servNo, instance, client) }, 10000)
}