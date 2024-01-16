import discord from 'discord.js';
import 'dotenv/config';
import fs from 'fs';
import { Command } from '../Types/Command';
import path from 'path';

const rest = new discord.REST({ version: "10" }).setToken(process.env.TOKEN as string);

export default class Client extends discord.Client {
    commands: discord.Collection<string, Command>

    constructor() {
        super({
            intents: ['Guilds']
        });

        this.commands = new discord.Collection();
    }

    async start() {

        try {
            console.log(`Loading all commands...\n`);

            var commands: any[] = [];
            const commandsPath = path.join(__dirname, "..", "Commands");
            for (const file of fs.readdirSync(commandsPath)) {
                var { command } = await import(`${commandsPath}/${file}`);
                commands.push(command.command.toJSON()) // Grab the SlashCommandBuilder to convert command to JSON
                this.commands.set(command.command.name, command);
                console.log(`Command ${command.command.name} loaded`);
            }

            console.log(`\nAll (${commands.length}) commands loaded, reloading through discord..`);
            
            if (process.env.DEVMODE == "1") {
                await rest.put(
                    discord.Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.DEVGUILD_ID as string),
                    { body: commands }
                );
            } else {
                await rest.put(
                    discord.Routes.applicationCommands(process.env.CLIENT_ID as string),
                    { body: commands }
                );
            }

            console.log(`All slash commands sent to discord and reloaded\n`);
        } catch (error) {
            console.error(`Unexpected exception caught when loading commands: ${error}`);
        }

        try {
            console.log(`Loading and binding events...\n`);

            const eventsPath = path.join(__dirname, "..", "Events");
            var eventCount = 0;
            for (const file of fs.readdirSync(eventsPath)) {
                var { event } = await import(`${eventsPath}/${file}`);
                this.on(event.name, event.callback.bind(null, this));
                console.log(`Event ${event.name} loaded and bound`);
                eventCount++;
            }

            console.log(`\nAll (${eventCount}) events loaded and bound successfully\n`);
        } catch (error) {
            console.error(`Unexpected exception caught when loading events: ${error}`);
        }
        
        this.login(process.env.TOKEN as string);
    }
}
