import { ActivityType } from "discord.js";
import { Event } from "../Types/Event";

export const event: Event = {
    name: "ready",
    callback: (client) => {
        console.log(`Client logged in as ${client.user?.tag}`);
        console.log(`Client took ${Date.now() - client.bootTime}ms to boot and connect to discord`);
        client.user?.setActivity("Supporting TheMostLethalCompany users", { type: ActivityType.Custom });
    }
}
