import { GuildMember, Message, TextChannel, time } from "discord.js";
import { config } from "./data";

// Auto ban will ban users who have sent 3 disallowed urls in the past 15 minutes
// Dictionary of users for extra knowledge on when ban conditions are met
let timeouts: Timeout = {}

interface Timeout {
    [id: string]: {
        count: number
        time: number
    }
}

// Regex string to match parts of a url, used to verify if the url is valid
const urlRegex = /(?:(https?):\/\/)?(?:(www)\.)?((?:[-a-zA-Z0-9]|(?<!\.)\.){2,255})(?<!\.)\.([a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

// False if URL check failed
export async function handleMessage(message: Message): Promise<boolean> {
    let matches = message.content.matchAll(urlRegex);

    let validMessage = true;
    let failed = [];
    for (let match of matches) {
        let result = checkURL(match);
        if (!result) {
            validMessage = false;
            failed.push(match);
        }
    }

    let prettyFailed = failed.map(val => val[0]); // Get first "match" in each url match. (This will be the entire matched string)

    // All URLs in message are valid
    if (!validMessage) {
        await message.delete();
        console.log(`Message sent by ${message.author.username} (${message.author.id}) was deleted for urls. (${prettyFailed.join(", ")})`);
        let id = message.author.id;
        if (Object.keys(timeouts).includes(id)) {
            if (Date.now() - timeouts[id].time > 15 * 60 * 1000) { // Out of 15 minute range
                timeouts[id] = { count: 1, time: Date.now() };
            } else { // Relative time is less than 15 minutes ago
                timeouts[id].count += 1;
                if (timeouts[id].count == 3) {
                    // 3 messages and relative time is less than 15 minutes ago
                    message.member?.ban({ deleteMessageSeconds: 60 * 30, reason: "URL Violation - Third infaction" });
                    delete timeouts[id];
                }
            }
        } else {
            timeouts[id] = { count: 1, time: Date.now() };
        }
        message.client.channels.fetch(config()["log_channel"]).then((channel) => {
            let embed = config()["whitelist_fail_embed"];
            embed.embeds[0].description += prettyFailed.join("\n");
            (channel as TextChannel).send(embed);
        })
        await message.author.send(`Your message (In https://discord.com/channels/${message.guildId}/${message.channelId}) contains disallowed urls. Please only send urls relating to the server. (ie. thunderstore, youtube, ect.) If you believe this is a mistake, please contact Clark.`);
        return false;
    }
    return true;
}

interface WhitelistGroupMatcher {
    [index: string]: string
}

interface WhitelistEntries {
    [name: string]: WhitelistGroupMatcher
}

function checkURL(match: RegExpMatchArray): boolean {
    let whitelist = config().whitelisted_urls as WhitelistEntries;
    for (let name of Object.keys(whitelist)) {
        let valid = true;
        for (let index of Object.keys(whitelist[name])) {
            if (!parseInt(index)) continue; // Invalid number provided
            if (!match[parseInt(index)]) continue; // Index not in array

            if (match[parseInt(index)] != whitelist[name][index]) { // Check if part is not equal
                valid = false;
                break;
            }
        }
        // Check if all parts were valid
        if (valid) {
            return true
        }
    }
    return false;
}
