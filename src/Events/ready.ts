import { ActivityType } from "discord.js";
import { Event } from "../Types/Event";

export const event: Event = {
    name: "ready",
    callback: (client) => {
        console.log(`Client logged in as ${client.user?.tag}`);
        client.user?.setActivity("Supporting TheMostLethalCompany users", { type: ActivityType.Custom });
    }
}
