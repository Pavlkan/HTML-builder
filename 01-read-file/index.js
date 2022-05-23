const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt' );

const rs = fs.createReadStream(pathToFile, "utf8");
rs.on('data', (chunk) => console.log(chunk));


