import { ThreadChannel } from "discord.js";
import { Event } from "../Types/Event";
import { waitForFirst } from "../Util/threadHelper";
import { config } from "../Util/data";

export const event: Event = {
    name: "threadCreate",
    callback: async (client, thread: ThreadChannel) => {
        if (thread.messageCount == 0 && thread.appliedTags.includes(config().issue_id)) { // Check if post has the "Issue" tag
            var embed = config().support_embed;
            embed.content = embed.content.replace("{supportMention}", `<@&${config().roles.support}>`);
            embed.content = embed.content.replace("{ownerMention}", `<@${thread.ownerId}>`);
            console.log("Thread created");
            await waitForFirst(thread);
            console.log("Sending thread message..");
            await thread.send(embed);
        }
    }
}
