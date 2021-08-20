import Discord = require('discord.js');
export function yesNoActionRow(yesStyle: Discord.MessageButtonStyleResolvable, noStyle: Discord.MessageButtonStyleResolvable) {
    return [
        new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId('BUTTON_YES')
                .setLabel("Yes")
                .setStyle(yesStyle),
            new Discord.MessageButton()
                .setCustomId("BUTTON_NO")
                .setLabel("No")
                .setStyle(noStyle)
        )
    ];
}
