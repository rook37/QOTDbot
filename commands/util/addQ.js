const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addq')
		.setDescription('Add a question to the queue')
        .addStringOption(option =>
            option.setName('question').setDescription('The question to be added'))
        .addIntegerOption(option=> option.setName('position').setDescription('The position in the queue for the question')),

	async execute(interaction, parseQ,fs) {
        const q = interaction.options.getString('question')
        const pos = interaction.options.getInteger('position') ?? 'No position provided';

        //TODO: once editq is in, have a shared function between the two to bump queue for insert at pos.

        let qs = parseQ(interaction.guildId);
        qs[Object.keys(qs).length] = '**QOTD:** '+q;
        fs.writeFileSync(String(interaction.guildId+'.json'), JSON.stringify(qs))       

		await interaction.reply(`Added "${q}" to the queue! Total questions loaded: ${Object.keys(qs).length}`);
	},
};

