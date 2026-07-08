const fs = require('fs/promises');

const directoriesToCopy = [
    { source: 'src/views', destination: 'dist/views' },
    { source: 'src/public', destination: 'dist/public' },
];

async function copyDirectories() {
    try {
        for (const directory of directoriesToCopy) {
            await fs.cp(directory.source, directory.destination, { recursive: true });
        }
        console.log('Successfully Duplicated!');
    } catch (error) {
        console.error('Error, extra:', error);
        process.exitCode = 1;
    }
}

copyDirectories().then();
