const { SlashCommandBuilder } = require('discord.js');
const { Blackjack } = require('discord-blackjack');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack2')
    .setDescription('Play a game of blackjack!'),
  async execute(interaction) {
    const filter = (user) => user.id === interaction.user.id;
    try {
      // Create a new instance of the game
      const game = new Blackjack(interaction.channel, filter);

      // Start the game
      await game.start();
      await game.deal();
      let response = await interaction.reply(game.getGameEmbed());

      // Loop until the game ends
      while (!game.isGameEnd()) {
        response.edit(game.getGameEmbed());
        response = await game.awaitPlayerResponse();

        // Check the player's response
        switch (response) {
          case 'hit':
            await game.hit();
            break;
          case 'stand':
            await game.stand();
            break;
          case 'double':
            await game.double();
            break;
          case 'surrender':
            await game.surrender();
            break;
          default:
            throw new Error('Invalid response');
        }
      }

      // End the game
      await game.end();
      await interaction.editReply(game.getGameEmbed());
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while playing the game.');
    }
  },
};
