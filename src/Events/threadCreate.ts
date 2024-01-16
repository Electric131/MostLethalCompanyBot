import { ThreadChannel } from "discord.js";
import { Event } from "../Types/Event";
import { waitForFirst } from "../Util/threadHelper";

export const event: Event = {
    name: "threadCreate",
    callback: async (client, thread: ThreadChannel) => {
        if (thread.appliedTags.includes(client.config.issue_id)) { // Check if post has the "Issue" tag
            var embed = client.config.embed_format;
            embed.content = embed.content.replace("{supportMention}", `<@&${client.config.support_role_id}>`);
            embed.content = embed.content.replace("{ownerMention}", `<@${thread.ownerId}>`);
            await waitForFirst(thread);
            await thread.send(embed);
        }
    }
}
