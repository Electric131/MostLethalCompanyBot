import configFile from "../config.json";

export function config(): typeof configFile {
    return JSON.parse(JSON.stringify(configFile)); // bind config to a new object
}
