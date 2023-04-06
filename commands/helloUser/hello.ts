const { SlashCommandBuilder } = require('@discordjs/builders');

function createDeck() {
  const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  const deck = [];
  for (let suit in suits) {
    for (let value in values) {
      deck.push(values[value] + ' of ' + suits[suit]);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }
  return deck;
}

function getCardValue(card) {
  let value = card.split(' ')[0];
  if (value === 'Ace') {
    return 11;
  } else if (value === 'King' || value === 'Queen' || value === 'Jack') {
    return 10;
  } else {
    return parseInt(value);
  }
}

function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (let i = 0; i < hand.length; i++) {
    const cardValue = getCardValue(hand[i]);
    if (cardValue === 11) {
      aces++;
    }
    value += cardValue;
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Starts a game of blackjack.'),
  async execute(interaction) {
    const playerHand = [];
    const dealerHand = [];
    const deck = shuffleDeck(createDeck());

    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());

    const dealerCard = getCardValue(dealerHand[0]);
    const playerScore = getHandValue(playerHand);

    let message = `Dealer has ${dealerHand[0]} and another card face down\n\n`;
    message += `You have ${playerHand[0]} and ${playerHand[1]} (${playerScore})\n\n`;
    message += `Type /hit to draw another card or /stand to keep your hand.`;
    await interaction.reply(message);

    const filter = (interaction) => {
      return interaction.user.id === interaction.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'hit') {
        playerHand.push(deck.pop());
        const playerScore = getHandValue(playerHand);

        if (playerScore > 21) {
          message = `You have busted with ${playerScore}!`;
          collector.stop();
        } else {
          message = `You drew ${playerHand[playerHand.length - 1]} (${playerScore})\n\n`;
          message += `Type /hit to draw another card or /stand to keep your hand.`;
        }
        await interaction.update({ content: message });
      } else if (interaction.customId === 'stand') {
        const dealerScore = getHandValue(dealerHand);
    
        while (dealerScore < 17) {
          dealerHand.push(deck.pop());
        }
    
        const dealerFinalScore = getHandValue(dealerHand);
    
        if (dealerFinalScore > 21) {
          message = `Dealer busts with ${dealerFinalScore}! You win!`;
        } else if (dealerFinalScore === playerScore) {
          message = `Dealer has ${dealerHand.join(', ')} (${dealerFinalScore})\n\n`;
          message += `It's a tie!`;
        } else if (dealerFinalScore > playerScore) {
          message = `Dealer has ${dealerHand.join(', ')} (${dealerFinalScore})\n\n`;
          message += `You lose!`;
        } else {
          message = `Dealer has ${dealerHand.join(', ')} (${dealerFinalScore})\n\n`;
          message += `You win!`;
        }
    
        await interaction.update({ content: message });
        collector.stop();
      }
    });
    
    collector.on('end', async () => {
      if (collector.total === 0) {
        message = 'You took too long to respond!';
        await interaction.followUp({ content: message });
      }
    });
  }
}    
