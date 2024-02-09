import { Command } from "../Types/Command";
import { SlashCommandBuilder } from 'discord.js';
import { config } from "../Util/data";

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
        console.log(`Tag requested, deferring reply`);
        await interaction.deferReply({ ephemeral: true }); // Send "Thinking..." message
		const reply = await interaction.fetchReply(); // Get that reply
        console.log(`Tag response ping is ${reply.createdTimestamp - interaction.createdTimestamp}ms`);

        let tagName = interaction.options.getString("name");
        // Ensure tag was provided, and that it is a valid tag
        if (tagName && Object.keys(config().custom_tags).includes(tagName)) {
            console.log(`Valid tag provided`);
            var response = config().tag_template;
            // Check if a target was provided
            let target = interaction.options.getUser("target");
            if (target) {
                response.content = `<@${target.id}>`;
            }
            response.embeds[0].footer.text = `Response requested by ${interaction.user.displayName}`;
            response.embeds[0].description = (config().custom_tags as Tags)[tagName];
            console.log(`Sending tag message: ${response.embeds[0].description}`);
            await interaction.channel?.send(response);
            await interaction.editReply({ content: `Tag completed.` });
            console.log(`Tag marked as completed`);
        } else {
            console.log(`Tag was invalid`);
            await interaction.editReply({ content: "Failed to find tag content." });
        }
	}
}
