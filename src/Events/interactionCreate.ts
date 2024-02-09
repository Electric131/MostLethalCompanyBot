import { Event } from "../Types/Event";
import { CommandInteractionExtension } from "../Types/Command";
import { Interaction } from "discord.js";
import { generatePage } from "../Commands/modlist";
import { clamp } from "../Util/math";

export const event: Event = {
    name: "interactionCreate",
    callback: async (client, interaction: Interaction) => {
        switch (true) {
            case interaction.isChatInputCommand():
                const command = client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                try {
                    await command.execute(client, interaction as CommandInteractionExtension);
                } catch (error) {
                    console.error(error);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
                    } else {
                        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
                    }
                }
                break;
            case interaction.isButton():
                try {
                    if (interaction.message.embeds[0].footer) {
                        let groups = /Page (\d+)\/(\d+)/g.exec(interaction.message.embeds[0].footer.text);
                        if (!groups) {
                            interaction.update({ content: "Interaction failed unexpectedly!" });
                            return;
                        }
                        let nextPage = parseInt(groups[1]) + (interaction.component.label == "Next" ? 1 : -1);
                        interaction.update(generatePage(clamp(nextPage, 1, parseInt(groups[2]))));
                    }
                } catch {}
                break;
        }
    }
}
