import { Command } from "../Types/Command";
import { SlashCommandBuilder } from 'discord.js';
import { config } from "../config";

var choices = Object.keys(config().custom_tags).map(val => {
    return { name: val, value: val }
});

const builder = new SlashCommandBuilder();
builder.setName("tag")
.setDescription("Send a long common message, all with a short tag.")
.addStringOption(option =>
    option
    .setName("name")
    .setDescription("Name of the tag")
    .setChoices(
        ...choices
    )
    .setRequired(true)
)
.addUserOption(option => 
    option
    .setName("target")
    .setDescription("The user that is the 'cause' of this tag")
    .setRequired(false)
);

interface Tags {
    [tagName: string]: string
}

export const command: Command = {
	command: builder,
	execute: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        if (interaction.options.data[0].value && typeof interaction.options.data[0].value == "string" && Object.keys(config().custom_tags).includes(interaction.options.data[0].value)) {
            var response = config().tag_template;
            if (interaction.options.data[1] && interaction.options.data[1].value) {
                response.content = `<@${interaction.options.data[1].value}>`;
            }
            response.embeds[0].footer.text = `Response requested by ${interaction.user.displayName}`;
            response.embeds[0].description = (config().custom_tags as Tags)[interaction.options.data[0].value];
            await interaction.channel?.send(response);
            await interaction.editReply({ content: `Tag completed.` });
        } else {
            await interaction.editReply({ content: "Failed to find tag content." });
        }
	}
}
