import Discord = require('discord.js');
const { prefix }: { prefix: string } = require('../config/config.json');
export function sendTimeoutError(time: number, message: Discord.Message) {
    message.channel.send( `Session timed out (${time}m). Please run \`${prefix}partner\` again if you still wish to try again.`);
}

export function sendInteractionTimeoutError(time: number, interaction: Discord.MessageComponentInteraction) {
    interaction.followUp(`Session timed out (${time}m). Please run \`${prefix}partner\` again if you still wish to try again.`);
}
