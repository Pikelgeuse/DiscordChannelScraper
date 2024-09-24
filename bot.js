const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Replace 'YOUR_BOT_TOKEN' with the bot token you got from the Discord Developer Portal
const TOKEN = 'GETYOUROWNTOKENSHEESH!!!'; //Make sure to replace this if you actually use this garbage bot 

// Channel ID of the channel you want to parse
const CHANNEL_ID = '1049581248600866857';

// Log when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  fetchAndLogMessages(CHANNEL_ID);
});

// Fetch messages from a channel and log them to a file
async function fetchAndLogMessages(channelId) {
  const channel = await client.channels.fetch(channelId);
  if (!channel) {
    console.error('Channel not found');
    return;
  }

  let messages = [];
  let lastMessageId;
  let totalMessagesFetched = 0; // Initialize counter
  
  // Fetch messages in batches of 100 (Discord API limit per request)
  while (true) {
    const options = { limit: 100 };
    if (lastMessageId) {
      options.before = lastMessageId;
    }

    const fetchedMessages = await channel.messages.fetch(options);
    messages.push(...fetchedMessages.map(m => `${m.author.tag} [${m.createdAt.toISOString()}]: ${m.content.replace(/\n/g, ' ')}`));
	
	// Update the total messages fetched and log it
    totalMessagesFetched += fetchedMessages.size;
    console.log(`Fetched ${fetchedMessages.size} messages... Total: ${totalMessagesFetched}`);

    if (fetchedMessages.size !== 100) {
      break; // Exit the loop if fewer than 100 messages were fetched
    }

    lastMessageId = fetchedMessages.last().id;
  }

  // Write messages to a text file
  const logFile = 'discord_channel_log.txt';
  fs.writeFileSync(logFile, messages.join('\n'), { flag: 'w' });
  console.log(`Logged ${messages.length} messages to ${logFile}`);
}

// Log in the bot
client.login(TOKEN);
