import { Command } from "../Types/Command";
import { CommandInteractionOptionResolver, GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import { config } from "../config";

export const command: Command = {
	command: new SlashCommandBuilder()
	.setName("modlist")
	.setDescription("Get the list of mods currently in the pack.")
    .addSubcommand(builder => {
        return builder
        .setName("set") // Subcommand is in the format of `/modlist set <list>`
        .setDescription("Set the list of mods. (Moderator Only)")
        .addStringOption(option => {
            return option.setRequired(true);
        });
    })
    .addSubcommand(builder => {
        return builder
        .setName("get") // Subcommand is in the format of `/modlist get`
        .setDescription("View the list of mods.");
    })as SlashCommandBuilder,
	execute: async (client, interaction) => {
		console.log(`Modlist requested, deferring reply`);
        await interaction.deferReply({ ephemeral: true }); // Send "Thinking..." message
		const reply = await interaction.fetchReply(); // Get that reply
        console.log(`Modlist response ping is ${reply.createdTimestamp - interaction.createdTimestamp}ms`);
        if (!interaction.member || !interaction.inCachedGuild()) { return; } // Shouldn't even be possible
        console.log((interaction.options as CommandInteractionOptionResolver).getSubcommand());
		if ((interaction.options as CommandInteractionOptionResolver).getSubcommand() == "set") { // Check if this is the set command
            if ((interaction.member.roles as GuildMemberRoleManager).cache.has(config().roles.moderator)) {
            
            } else {
                
            }
        } else {

        }
	}
}
