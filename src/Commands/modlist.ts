import { Command, CommandInteractionExtension } from "../Types/Command";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteractionOptionResolver, GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js';
import { config, volatile } from "../Util/data";

const builder = new SlashCommandBuilder();
builder.setName("modlist")
.setDescription("Get the list of mods currently in the pack.")
.addSubcommand(builder =>
    builder
    .setName("set") // Subcommand is in the format of `/modlist set <list>`
    .setDescription("Set the list of mods. (Moderator Only)")
    .addStringOption(option =>
        option.setName("dependency-string")
        .setDescription("Dependency string of the modpack (Maybe with a few trims, i.e. apis/libraries)")
        .setRequired(true)
    )
)
.addSubcommand(builder => {
    return builder
    .setName("get") // Subcommand is in the format of `/modlist get`
    .setDescription("View the list of mods.");
});

// Groups: [ Author, Modname, Version ]
const dependencyRegex = /(.+?)-(.+?)-((?:\d+\.?)+)/gm;

export const command: Command = {
	command: builder,
	execute: async (client, interaction) => {
		console.log(`Modlist requested, deferring reply`);
        await interaction.deferReply({ ephemeral: true }); // Send "Thinking..." message
		const reply = await interaction.fetchReply(); // Get that reply
        console.log(`Modlist response ping is ${reply.createdTimestamp - interaction.createdTimestamp}ms`);
        if (!interaction.member || !interaction.inCachedGuild()) { return; } // Shouldn't even be possible
		if ((interaction.options as CommandInteractionOptionResolver).getSubcommand() == "set") { // Check if this is the set command
            if ((interaction.member.roles as GuildMemberRoleManager).cache.has(config().roles.moderator)) {
                // Member is moderator, allow setting the list.
                let dependencyString = interaction.options.getString("dependency-string");
                if (!dependencyString) {
                    interaction.editReply({ content: `Dependency string must be provided.` });
                    return;
                }
                dependencyString = dependencyString.replace(" ", "\n");
                if (dependencyRegex.test(dependencyString)) { // Given string matches a valid dependency string
                    if (dependencyString.length >= 8000) {
                        // Don't kill the server storage..
                        interaction.editReply({ content: `Dependency string is too long. (Talk to Electric if this is a mistake)` });
                    } else {
                        volatile.set("modlist", interaction.options.getString("dependency-string"));
                        interaction.editReply({ content: `Modlist updated.` });
                    }
                } else {
                    interaction.editReply({ content: `Invalid dependency string provided.` });
                }
            } else {
                // Member is not a moderator, deny command
                interaction.editReply({ content: `Only moderators can use this command.` });
            }
        } else {
            let reply = await interaction.editReply(generatePage());
            // May use collector in the future.. (but it's timed, so I'll just use the interactionCreate event)
            // let collector = reply.createMessageComponentCollector({ time: 5000 });
            // collector.on("collect", async i => {
            //     console.log(i);
            //     if (!i.message.embeds[0].footer) return;
            //     let groups = /Page (\d+)\/(\d+)/g.exec(i.message.embeds[0].footer.text);
            //         if (!groups) {
            //             i.update({ content: "Interaction failed unexpectedly!" });
            //             return;
            //         }
            //         await i.update(generatePage(parseInt(groups[1]) + 1));
            // })
        }
	}
}

export function generatePage(pageNum: number = 1) {
    // Generate mod list as clickable links
    const maxPerPage = 20;
    let sorted = [];
    let entries = volatile.get("modlist").split(" ");
    for (const entry of entries) {
        let groups = dependencyRegex.exec(entry);
        dependencyRegex.lastIndex = 0;
        if (!groups) continue; // Skip if somehow match failed
        // Groups: [ Author, Modname, Version ]  (index 0 is full match)
        let text = `[${groups[2]} v${groups[3]} (By ${groups[1]})](https://thunderstore.io/c/lethal-company/p/${groups[1]}/${groups[2]}/)`;
        sorted.push(text);
    }
    let page = [];
    let pages = [];
    let length = 0;
    for (const entry of sorted.sort()) {
        length += entry.length;
        if (page.length >= maxPerPage || length > 4096) { // Length of 4096 is the max the message can contain
            pages.push(page);
            page = [];
            length = 0;
        }
        page.push(entry);
    }
    if (page.length > 0) {
        pages.push(page);
        page = [];
        length = 0;
    }

    // Prepare buttons
    const back = new ButtonBuilder()
    .setCustomId('back')
    .setLabel('Back')
    .setStyle(ButtonStyle.Primary);

    const next = new ButtonBuilder()
    .setCustomId('next')
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
    .addComponents(back, next);

    let message = config().modlist_embed as any; // Use any to add parameters that do not exist
    message.components = [ row ];
    message.embeds[0].title = `Current Modlist (${entries.length} mods)`
    message.embeds[0].footer = { text: `Page ${pageNum}/${pages.length}` }
    message.embeds[0].description = pages[pageNum - 1].join("\n");
    return message;
}
