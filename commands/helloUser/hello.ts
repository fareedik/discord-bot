const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {

        let Card_1 = Math.floor(Math.random() * 21)
		let Card_2 = Math.floor(Math.random() * 21)
		let Card_3 = Math.floor(Math.random() * 21)
		console.log(Card_1+ " " + Card_2);
		let sum = Card_1 + Card_2;
		if(sum == 21){

			await interaction.reply("  Card_1 : "+Card_1.toString()+"  Card 2 : "+Card_2.toString()+" The Sum of your Card is " +sum.toString()+" You have won the Blackjack");
		} 
		else if (sum !== 21)
		{
		 await interaction.reply("You will have to pick a card")

		}
		
		
	},
};