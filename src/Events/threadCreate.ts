import { ThreadChannel } from "discord.js";
import { Event } from "../Types/Event";
import { waitForFirst } from "../Util/threadHelper";
import { config } from "../config";

export const event: Event = {
    name: "threadCreate",
    callback: async (client, thread: ThreadChannel) => {
        if (thread.messageCount == 0 && thread.appliedTags.includes(config().issue_id)) { // Check if post has the "Issue" tag
            var embed = config().embed_format;
            embed.content = embed.content.replace("{supportMention}", `<@&${config().support_role_id}>`);
            embed.content = embed.content.replace("{ownerMention}", `<@${thread.ownerId}>`);
            await waitForFirst(thread);
            await thread.send(embed);
        }
    }
}
