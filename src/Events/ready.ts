import { Event } from "../Types/Event";

export const event: Event = {
    name: "ready",
    callback: (client) => {
        console.log(`Client logged in as ${client.user?.tag}`);
    }
}
