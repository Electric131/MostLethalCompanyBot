import { ThreadChannel } from "discord.js";

export async function waitForFirst(thread: ThreadChannel) {
    await new Promise(async (res, rej) => {
        var exit = false;
        while (!exit) {
            console.log("Looking for first message...");
            await thread.fetchStarterMessage()
            .then((message) => {
                console.log(message);
                if (message == null) return;
                exit = true;
                console.log("First message found: " + message?.content);
                res(message);
            }).catch(() => {})
        }
    });
}
