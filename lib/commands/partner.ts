import Discord = require('discord.js');
import { sendInteractionTimeoutError, sendTimeoutError } from '../timeoutError';
import { sleep } from '../util';
import { yesNoActionRow } from '../yesNoActionRow';

const codeBlue = 0x24ACF2;
const errorRed = 0xD72D42;
const filter = (m: Discord.MessageComponentInteraction) => { m.deferUpdate(); return true; };

const actionRowLinks = ["https://www.youtube.com/watch?v=cGRsCLDArzQ", "https://www.youtube.com/watch?v=iik25wqIuFo", "https://www.youtube.com/watch?v=iik25wqIuFo", "https://www.youtube.com/watch?v=iik25wqIuFo"];

export async function partner(message: Discord.Message, client: Discord.Client) {
    const appIntroEmbed = new Discord.MessageEmbed()
        .setTitle("Partner Application")
        .setDescription("So, you wanna partner with us? That's great! Just tell us a bit about yourself, and we'll have you up and going in no time. This process should be very easy, we just need to know a few things about your server.")
        .setColor(codeBlue);
    const fakeActionRow = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton().setLabel("Important Information").setStyle("LINK").setURL(actionRowLinks[Math.floor(Math.random() * (3 - 0 + 1) + 0)])
    );
    await message.channel.send({ embeds: [appIntroEmbed], components: [fakeActionRow] });
    await message.channel.sendTyping();
    await sleep(5000);
    const isAuthorizedEmbed = new Discord.MessageEmbed()
        .setTitle("Are you authorized to apply on behalf of your server?")
        .setDescription("To apply for partnership, you must be the owner of the server in question, or authorized by the owner of the aformentioned server. Usually, if you're a server admin, community manager, or someone in a high position within the server staff, you should be fine.")
        .setFooter("Session will close after 1 minute of activity.")
        .setColor(codeBlue);
    message.channel.send({ embeds: [isAuthorizedEmbed], components: yesNoActionRow("PRIMARY", "SECONDARY") });
    try {
        var collectedInteraction = await message.channel.awaitMessageComponent({ filter, time: 60000 }); // eslint-disable-line no-var
    }
    catch {
        sendTimeoutError(1, message);
        return;
    }
    if (collectedInteraction.customId === "BUTTON_NO") {
        message.channel.send("Unfortunately, you must be authorized by the server owner to partner with us. Try getting in contact with a server admin if you think that they should partner with us.");
        return;
    }
    const membersLimitEmbed = new Discord.MessageEmbed()
        .setTitle("Does your server have at least 75 members?")
        .setDescription("We require that the servers that we partner with have at least that many members.")
        .setFooter("Session will close after 1 minute of activity.")
        .setColor(codeBlue);
    message.channel.send({ embeds: [membersLimitEmbed], components: yesNoActionRow("PRIMARY", "SECONDARY") });
    try {
        collectedInteraction = await message.channel.awaitMessageComponent({ filter, time: 60000 });
    }
    catch {
        sendInteractionTimeoutError(1, collectedInteraction);
        return;
    }
    if (collectedInteraction.customId === "BUTTON_NO") {
        message.channel.send("Unfortunately, your server doesn't meet the requirements for partnership yet. Come back when you do hit the member requirement!");
        return;
    }
    const isNSFWEmbed = new Discord.MessageEmbed()
        .setTitle("Is your community based around NSFW content?")
        .setDescription("Communities based around NSFW content are not permitted to partner with us. We want to keep everything a SFW and wholesome experience, and partnering with NSFW servers would go against that.")
        .setFooter("Session will close after 1 minute of inactivity.")
        .setColor(codeBlue);
    message.channel.send({ embeds: [isNSFWEmbed], components: yesNoActionRow("DANGER", "SECONDARY") });
    try {
        collectedInteraction = await message.channel.awaitMessageComponent({ filter, time: 60000 });
    }
    catch {
        sendInteractionTimeoutError(1, collectedInteraction);
        return;
    }
    if (collectedInteraction.customId === "BUTTON_YES") {
        message.channel.send("Sorry, your community doesn't meet the requirements to partner with us.");
        return;
    }
    const serverNameEmbed = new Discord.MessageEmbed()
        .setTitle("What's the name of your community?")
        .setDescription("Pretty self explanatory. We need the name of your community to be able to list it in our affiliates channel.")
        .setFooter("Session will close after 5 minutes of inactivity.")
        .setColor(codeBlue);
    await message.channel.send({ embeds: [serverNameEmbed] });
    try {
        const filter = () => true;
        var collectedMessage = await message.channel.awaitMessages({ filter, max: 1, time: 300000 }); // eslint-disable-line no-var
    }
    catch {
        sendTimeoutError(5, message);
        return;
    }
    const serverName = collectedMessage.first().content.substr(0, 255);
    const serverContentEmbed = new Discord.MessageEmbed()
        .setTitle(`What is ${serverName} about?`)
        .setDescription(`To get a good idea of if ${serverName} is an ideal partner for us, please tell us about what it is based around.\n**Please keep it under 1024 characters.**`)
        .setFooter("Session will close after 10 minutes of activity.")
        .setColor(codeBlue);
    await message.channel.send({ embeds: [serverContentEmbed] });
    try {
        const filter = () => true;
        collectedMessage = await message.channel.awaitMessages({ filter, max: 1, time: 600000 });
    }
    catch {
        sendTimeoutError(10, message);
        return;
    }
    const serverContent = collectedMessage.first().content.substr(0, 1023);
    const inviteRequestEmbed = new Discord.MessageEmbed()
        .setTitle("We'll need an invite.")
        .setDescription(`If we do partner with ${serverName}, we'll need an invite to link it when we list it in the affiliates channel.\n**Please send an invite to ${serverName} that never expires and links to a general/welcome/rules channel, and pleas ensure that it's a full invite URL (e.g.** \`https://discord.gg/M6QpWAd4aX\`**).**`)
        .setFooter("Session will close after 5 minutes of inactivity.")
        .setColor(codeBlue);
    await message.channel.send({ embeds: [inviteRequestEmbed] });
    try {
        const filter = (m: Discord.Message) => /^\s*(?:https:\/\/discord\.gg\/|https:\/\/discord\.com\/invite\/)[a-zA-Z0-9]+\s*$/.test(m.content);
        collectedMessage = await message.channel.awaitMessages({ filter, max: 1, time: 300000 });
    }
    catch {
        sendTimeoutError(5, message);
        return;
    }
    const serverInvite = collectedMessage.first().content;
    const finalStepEmbed = new Discord.MessageEmbed()
        .setTitle("Everything look good?")
        .setDescription("Below is all the information you provided in your application. Look everything over, and if all looks well, select 'yes' to send your application, or 'no' if something is wrong.")
        .addFields(
            [
                {
                    name: "Community Name",
                    value: serverName
                },
                {
                    name: "Applicant",
                    value: `<@${message.author.id}> (${message.author.tag})`
                },
                {
                    name: "Meets Member Count",
                    value: "Yes",
                    inline: true
                },
                {
                    name: "Is Authorized by Server",
                    value: "Yes",
                    inline: true
                },
                {
                    name: "Is SFW Community",
                    value: "Yes",
                    inline: true
                },
                {
                    name: "About Community",
                    value: serverContent
                },
                {
                    name: "Invite",
                    value: serverInvite
                }
            ]
        )
        .setFooter("Session will close after 5 minutes of inactivity.")
        .setColor(codeBlue);
    await message.channel.send({ embeds: [finalStepEmbed], components: yesNoActionRow("PRIMARY", "DANGER") });
    try {
        collectedInteraction = await message.channel.awaitMessageComponent({ filter, time: 300000 });
    }
    catch {
        sendTimeoutError(5, message);
        return;
    }
    if (collectedInteraction.customId === "BUTTON_NO") {
        const discardedEmbed = new Discord.MessageEmbed()
            .setDescription(":x: Application discarded!")
            .setColor(errorRed);
        await message.channel.send({embeds: [discardedEmbed]});
        return;
    }
    const sentEmbed = new Discord.MessageEmbed()
        .setDescription(":white_check_mark: Application submitted!")
        .setColor(codeBlue);
    await message.channel.send({embeds: [sentEmbed]});

    const formattedApplicationEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL({dynamic: false}))
        .setTitle(`Application: ${serverName}`)
        .addFields(
            [
                {
                    name: "Community Name",
                    value: serverName
                },
                {
                    name: "Applicant",
                    value: `<@${message.author.id}> (${message.author.tag})`
                },
                {
                    name: "Meets Member Count",
                    value: "Yes",
                    inline: true
                },
                {
                    name: "Is Authorized by Server",
                    value: "Yes",
                    inline: true
                },
                {
                    name: "Is SFW Community",
                    value: "Yes",
                    inline: true
                },
                {
                    name: "About Community",
                    value: serverContent
                },
                {
                    name: "Invite",
                    value: serverInvite
                }
            ]
        )
        .setTimestamp(new Date())
        .setColor(codeBlue);
    ((await client.channels.fetch('878112108968017931')) as Discord.TextChannel).send({embeds: [formattedApplicationEmbed]});
}
