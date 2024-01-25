import Client from './Client';
console.clear();

const client = new Client();

process.on('unhandledRejection', async (reason, promise) => {
    console.log(`Unhandled rejection at: ${promise} ; Reason: ${reason}`);
});

process.on('unhandledException', (err) => {
    console.log(`Unhandled exception: ${err}`);
});

client.start();
