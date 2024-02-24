import { Message } from "discord.js";
import { Event } from "../Types/Event";
import { config } from "../Util/data";
import { handleMessage } from "../Util/urlCheck";

export const event: Event = {
    name: "messageUpdate",
    callback: async (client, oldMessage: Message, newMessage: Message) => {
        // Message is in a guild, and member is not a moderator
        if (newMessage.content && newMessage.inGuild() && !newMessage.member?.roles?.cache.has(config().roles.moderator)) {
            await handleMessage(newMessage)
        }
    }
}
