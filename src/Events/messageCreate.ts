import { Message } from "discord.js";
import { Event } from "../Types/Event";
import { config } from "../config";

export const event: Event = {
    name: "messageCreate",
    callback: (client, message: Message) => {
        if (message.channel.id == config().updates_channel) {
            if (message.crosspostable && message.content.match(config().updates_regex)) {
                message.crosspost();
            }
        }
    }
}
