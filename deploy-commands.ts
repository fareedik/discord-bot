// Import dotenv
const dotenv = require('dotenv');
// Configure dotenv
dotenv.config()
// dotenv check
console.log(`Client Key: ${process.env.CLIENT_KEY}, Guild ID: ${process.env.GUILD_ID}, Token: ${process.env.DISCORD_TOKEN}`)
const { join } = require('node:path');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// -> Read command folders
const commandFolders = fs.readdirSync(join(__dirname, 'commands'));

// -> Read command files
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(
    join(__dirname, 'commands', folder),
  ).filter((file) => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command = require(join(
      __dirname,
      'commands',
      folder,
      file,
    ));
    console.log(command.data.toJSON());
    console.log(commands);
    commands.push(command.data.toJSON());
    console.log(commands);
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_KEY, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
