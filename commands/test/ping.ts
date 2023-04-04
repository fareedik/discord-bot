const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wing')
		.setDescription('Replies with Pong!'),
	async execute(interaction: { reply: (arg0: string) => any; }) {
		await interaction.reply('Pong!');
	},
};
