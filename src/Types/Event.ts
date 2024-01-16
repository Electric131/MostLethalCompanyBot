import { ClientEvents } from 'discord.js';
import Client from '../Client';

interface Callback {
    (client: Client, ...args: any[]): void
}

export interface Event {
    name: keyof ClientEvents;
    callback: Callback;
}
