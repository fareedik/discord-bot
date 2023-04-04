const blackjack = require('./BlackJackBasic');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription(`Let's play Black Jack Game!`),
    async execute(interaction) {
        await interaction.reply(blackjack.execute(interaction));
    },
};