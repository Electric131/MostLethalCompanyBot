import { Message } from "discord.js";
import { config } from "./data";

// Regex string to match parts of a url, used to verify if the url is valid
const urlRegex = /(?:(https?):\/\/)?(?:(www)\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})\.([a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

// False if URL check failed
export async function handleMessage(message: Message): Promise<boolean> {
    let matches = message.content.matchAll(urlRegex);

    let validMessage = true;
    for (let match of matches) {
        let result = checkURL(match);
        if (!result) {
            validMessage = false;
            break;
        }
    }

    // All URLs in message are valid
    if (!validMessage) {
        console.log(`Message sent by ${message.author.username} (${message.author.id}) was deleted for urls.`);
        await message.author.send(`Your message (In https://discord.com/channels/${message.guildId}/${message.channelId}) contains disallowed urls. Please only send urls relating to the server. (ie. thunderstore, youtube, ect.) If you believe this is a mistake, please contact Clark.`);
        await message.delete();
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
