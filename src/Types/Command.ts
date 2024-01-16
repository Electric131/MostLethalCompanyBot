import Client from '../Client';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Execute {
    (client: Client, interaction: CommandInteraction): void
}

export interface Command {
    command: SlashCommandBuilder,
    execute: Execute
}
