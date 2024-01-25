import { Event } from "../Types/Event";

export const event: Event = {
    name: "error",
    callback: (client, err) => {
        console.error(`Unexpected bot error occurred: ${err}`);
    }
}
