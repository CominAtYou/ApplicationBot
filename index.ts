import Discord = require('discord.js');
import { partner } from './lib/commands/partner';
const config: {token: string, prefix: string} = require('./config/config.json');

const client = new Discord.Client({intents: ["DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILD_MEMBERS"], partials: ['CHANNEL']});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (message.channel.type === "DM" && command === "partner") {
        partner(message, client);
    }
});

client.on('ready', () => {
    console.log("Bot is ready");
})

client.login(config.token);
