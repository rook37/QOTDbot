const { SlashCommandBuilder, ModalBuilder,TextInputBuilder,ActionRowBuilder,TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startq')
		.setDescription('Start the daily question timer'),
        
	
    
    async execute(interaction, parseQ,fs) {

        const modal = new ModalBuilder()
			.setCustomId('startqMod')
			.setTitle('What time should questions be posted?');
            
        const timeInput = new TextInputBuilder()
			.setCustomId('timeInput')
			.setLabel("Please enter in a 24hr format (eg 3PM = 1500)")
			.setStyle(TextInputStyle.Short)
            .setValue('900');
        const tzInput = new TextInputBuilder()
			.setCustomId('tzInput')
			.setLabel("What is your timezone?")
			.setStyle(TextInputStyle.Short)
            .setValue('EST');
        const row1 = new ActionRowBuilder().addComponents(timeInput);
        const row2 = new ActionRowBuilder().addComponents(tzInput);
        modal.addComponents(row1,row2);
        interaction.showModal(modal)
        const filter = (interaction) => interaction.customId === 'startqMod';
        var timeRes = 0;
        var tzRes = 'EST';
            
        await interaction.awaitModalSubmit({ filter, time: 60_000 })
            .then(interaction => {
                timeRes = interaction.fields.getTextInputValue('timeInput');
                tzRes = interaction.fields.getTextInputValue('tzInput');
                interaction.reply('Thanks!');
                console.log(`${timeRes} and tz is ${tzRes}`)}
                )  
            .catch(console.error);
        console.log(timeRes+' and tz is stilll '+tzRes)
        
	},
};


