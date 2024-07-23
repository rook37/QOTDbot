const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const { parseQ } = require('../../helper')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qstop')
		.setDescription('Stop the 24hr question loop'),

	async execute(interaction, parseQ,fs) {
        let jsonName = interaction.guildId+'cfg.json'
        try{
            let file = fs.readFileSync(jsonName);
            serverConfig = JSON.parse(file)
            serverConfig.posting = 0
            fs.writeFileSync(
                String(jsonName),
                JSON.stringify(serverConfig))
            
        } catch (er){
            console.log(er)
        }

		await interaction.reply(`Questions stopped!`);
	},
};

