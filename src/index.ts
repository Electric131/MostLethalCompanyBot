import Client from './Client';
console.clear();

const client = new Client();

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.start();
