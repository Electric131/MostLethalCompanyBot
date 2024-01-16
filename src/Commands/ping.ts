import { Command } from "../Types/Command";
import { SlashCommandBuilder } from 'discord.js';

export const command: Command = {
	command: new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Return the ping of the bot."),
	execute: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true }); // Send "Thinking..." message
		const reply = await interaction.fetchReply(); // Get that reply
		interaction.editReply({ content: `Pong! ${reply.createdTimestamp - interaction.createdTimestamp}ms` });
	}
}
