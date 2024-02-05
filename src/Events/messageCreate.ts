import { Message } from "discord.js";
import { Event } from "../Types/Event";
import { config } from "../config";

export const event: Event = {
    name: "messageCreate",
    callback: (client, message: Message) => {
        if (message.channel.id == config().updates_channel) {
            if (message.crosspostable && message.content.match(config().updates_regex)) {
                message.crosspost();
                return;
            }
        }
        // Message was posted in a thread, and thread is the support thread, and message was sent by OP
        if (message.thread && message.thread.id == config().support_thread_id && message.thread.ownerId == message.author.id) {
            console.log(message.content);
            // Message contains either ("pirated" or "cracked") AND contains either ("game" or "version")
            if ((message.content.includes("pirated") || message.content.includes("cracked")) && (message.content.includes("game") || message.content.includes("version"))) {
                console.log("flagged");
            }
        }
    }
}
