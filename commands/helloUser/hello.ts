const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        let num = Math.floor(Math.random() * 8); 
		await interaction.reply(num.toString());
	},
};