const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
const { stdin: input, stdout: output, exit } = require('process');
const readline = require('readline');

const wrs = fs.createWriteStream(pathToFile);
const rl = readline.createInterface({input, output});

output.write('Hello! Write something!\n');

rl.on('line', (input) => {
    if (input !== 'exit') {
        wrs.write(input)
    } else {
        output.write('You are exiting, bye)\n');
        exit(0);
    }
});

rl.on('close', () => {
    output.write('It is closing, bye)\n');
})