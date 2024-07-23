const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const { parseQ } = require('../../helper')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('qhelp')
		.setDescription('List commands and instructions!'),

	async execute(interaction, parseeQ,fss) {
        const embed = {"color": 1752220,"description":
            '\n\n**!Qstart** will start the loop, posting the next question every 24 hours from that time'+
            '\n\n**!Qstart ### minutes** will start the loop at ### minutes time from now, posting the next question every 24 hours from that time'+
            '\n\n**!Qstart ### hours** will start the loop at ### hours from now, posting the next question every 24 hours from that time'+
            '\n\n**!Qstop** will stop the loop'+
            '\n\n**!Qadd "question"** will add a question to the queue. **!addQ** also works'+
            '\n\n**!Qlist** or **!dailyQ** will post the list of questions currently queued up, and their #'+
            '\n\n**!Qedit # "question"** will replace the question at the specified # with a new one.**!editQ** also works.'+
            '\n\n**!Qdelete #** will delete the question at the specified #. **!deleteQ** also works'+
            '\n\n**!Qclear** or **!clearQ** will clear the queue of all stored questions'+
            '\n\n**!Qideas** will post the link to read the suggestions received so far (<https://bit.ly/36uR8uN>)'+
            '\n\n**!Qhelp** - Uh, you are here.'+
            '\n\n*(also the commands are not case-sensitive, so, y\'know, "!qClEaR" is fine)*'
        }
            
		await interaction.reply({content:' **QOTDBot Admin Commands**',embeds:[embed]});
	},
};

