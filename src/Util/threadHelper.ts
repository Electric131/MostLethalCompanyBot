import { ThreadChannel } from "discord.js";

export async function waitForFirst(thread: ThreadChannel) {
    await new Promise(async (res, rej) => {
        var exit = false;
        while (!exit) {
            await thread.fetchStarterMessage()
            .then((message) => {
                exit = true;
                res(message);
            }).catch(() => {})
        }
    });
}
