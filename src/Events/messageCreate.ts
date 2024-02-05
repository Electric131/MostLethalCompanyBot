import { Message } from "discord.js";
import { Event } from "../Types/Event";
import { config } from "../config";
import { waitForFirst } from "../Util/threadHelper";

export const event: Event = {
    name: "messageCreate",
    callback: async (client, message: Message) => {
        if (message.channel.id == config().updates_channel) {
            if (message.crosspostable && message.content.match(config().updates_regex)) {
                message.crosspost();
                return;
            }
        }
        // Message was posted in a thread, and thread is the support thread, and message was sent by OP
        if (message.channel.isThread() && message.channel.parentId == config().support_thread_id && message.channel.ownerId == message.author.id) {
            // Message contains either ("pirated" or "cracked") AND contains any of ("game" or "version" or "copy")
            if ((message.content.includes("pirated") || message.content.includes("cracked")) && (message.content.includes("game") || message.content.includes("version") || message.content.includes("copy"))) {
                await waitForFirst(message.channel); // Make sure thread does exist (mainly for first message)
                var response = config().tag_template;
                response.content = `<@${message.author.id}>`;
                response.embeds[0].footer.text = `(Automated Response)`;
                response.embeds[0].description = config().custom_tags.pirated;
                console.log(`Sending tag message: ${response.embeds[0].description}`);
                await message.channel?.send(response);
            }
        }
    }
}
