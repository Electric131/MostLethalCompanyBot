import path from "path";
import configFile from "../../config.json";
import fs from "fs";

// From config.json
// config data is read-only
export function config(): typeof configFile {
    return JSON.parse(JSON.stringify(configFile)); // bind config to a new object
}

interface DataFormat {
    [key: string]: any
}

var volatileData: DataFormat = {};
// Match raw filename, and use / or \ based on OS
const volatilePath = __filename.replace(/[\\/]build[\\/]Util.+/g, "") + `${__filename.includes("/") ? "/" : "\\"}volatile.json`;
console.log(`Volatile data path: ${volatilePath}`);
var hasRead = false;

// From volatile.json
// "volatile" data is data that needs to be saved, and is used for data *storage*
export const volatile = {
    set: function(key: string, value: any) {
        volatileData[key] = value;
        fs.writeFileSync(volatilePath, JSON.stringify(volatileData, null, 4));
    },
    get: function(key: string) {
        if (!hasRead) { // First read, load contents of JSON file into memory
            hasRead = true;
            volatileData = JSON.parse(fs.readFileSync(volatilePath).toString());
        }
        return (JSON.parse(JSON.stringify(volatileData[key])));
    }
}
