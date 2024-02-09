import Client from '../Client';
import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';

interface Execute {
    (client: Client, interaction: CommandInteractionExtension): void
}

export interface CommandInteractionExtension extends CommandInteraction {
    options: CommandInteractionOptionResolver
}

export interface Command {
    command: SlashCommandBuilder,
    execute: Execute
}
