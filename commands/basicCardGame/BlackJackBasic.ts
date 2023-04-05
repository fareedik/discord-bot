const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack2')
    .setDescription('Play a game of Blackjack'),
  async execute(interaction) {

  // Deck of cards
   const Deck = [
      "A♠️","2♠️","3♠️","4♠️","5♠️","6♠️","7♠️","8♠️","9♠️","10♠️","J♠️","Q♠️","K♠️",
      "A♥️","2♥️","3♥️","4♥️","5♥️","6♥️","7♥️","8♥️","9♥️","10♥️","J♥️","Q♥️","K♥️",
      "A♣️","2♣️","3♣️","4♣️","5♣️","6♣️","7♣️","8♣️","9♣️","10♣️","J♣️","Q♣️","K♣️",
      "A♦️","2♦️","3♦️","4♦️","5♦️","6♦️","7♦️","8♦️","9♦️","10♦️","J♦️","Q♦️","K♦️"
    ];

  // Shuffle the deck
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
    shuffle(Deck);

    // Player and dealer hands
    const playerHand = [Deck[0], Deck[2]];
    const dealerHand = [Deck[1], Deck[3]];

    // Calculate the score of the player's hand
    const playerScore = () => {
      let score = 0;
      let hasAce = false;
      for (const card of playerHand) {
        switch (card.slice(0, -1)) {
          case "A":
            score += 11;
            hasAce = true;
            break;
          case "J":
          case "Q":
          case "K":
            score += 10;
            break;
          default:
            score += Number(card.slice(0, -1));
            break;
        }
      }
      if (score > 21 && hasAce) {
        score -= 10;
      }
      return score;
    };

    // Calculate the score of the dealer's hand
    const dealerScore = () => {
      let score = 0;
      let hasAce = false;
      for (const card of dealerHand) {
        switch (card.slice(0, -1)) {
          case "A":
            score += 11;
            hasAce = true;
            break;
          case "J":
          case "Q":
          case "K":
            score += 10;
            break;
          default:
            score += Number(card.slice(0, -1));
            break;
        }
      }
      if (score > 21 && hasAce) {
        score -= 10;
      }
      return score;
    };

    // Convert the player's hand to a string
    const playerString = () => {
      let handString = "";
      for (const card of playerHand) {
        handString += `${card} `;
      }
      return handString;
    }

    // Convert the dealer's hand to a string
    const dealerString = () => {
      let handString = "";
      for (const card of dealerHand) {
        handString += `${card} `;
      }
      return handString;
    }

    // Hit function
    const hit = () => {
      playerHand.push(Deck[Deck.length - 1]);
      Deck.pop();
    }

    // Dealer's turn
    const dealerTurn = () => {
      while (dealerScore() < 17) {
        dealerHand.push(Deck[Deck.length - 1]);
        Deck.pop();
      }
    }

    // Check who won
    const checkWin = () => {
      if (playerScore() > 21) {
        return "You busted! You lose!";
      } else if (dealerScore() > 21) {
        return "The dealer busted! You win!";
      } else if (playerScore() === 21) {
        return "Blackjack! You win!";
      } else if (dealerScore() === 21) {
        return "Blackjack! You lose!";
      } else if (playerScore() > dealerScore()) {
        return "You win!";
      } else if (playerScore() < dealerScore()) {
        return "You lose!";
      } else {
        return "It's a tie!";
      }
    }

    // Start the game
    await interaction.reply(`Your hand: ${playerString()}\nDealer hand: ${dealerHand[0]} **?**\nYour score: ${playerScore()}\nDealer score: ${dealerScore()}`);
    // Prompt the user to hit or stand
    await interaction.reply(`Hit or stand?`);

    // Create a message collector
    const filter = m => m.author.id === interaction.user.id;

    // Collect the user's response
    const collector = interaction.channel.createMessageCollector(filter, { time: 15000 });

    // Check the user's response
    collector.on('collect', m => {
      if (m.content.toLowerCase() === 'hit') {
        hit();
        interaction.reply(`Your hand: ${playerString()}\nDealer hand: ${dealerHand[0]} **?**\nYour score: ${playerScore()}\nDealer score: ${dealerScore()}`);
      } else if (m.content.toLowerCase() === 'stand') {
        dealerTurn();
        interaction.reply(`Your hand: ${playerString()}\nDealer hand: ${dealerString()}\nYour score: ${playerScore()}\nDealer score: ${dealerScore()}`);
        interaction.reply(checkWin());
        collector.stop();
      } else {
        interaction.reply(`Please enter 'hit' or 'stand'`);
      }
    });

    // If the user doesn't respond in time
    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.reply('You took too long to respond!');
      }
    });
  },
};
