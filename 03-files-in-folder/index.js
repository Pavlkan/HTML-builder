const fs = require('fs');
const path = require('path');
const pathToFilesDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFilesDir, { withFileTypes: true }, (_, files) => {
    files.map((file) => {
        if (file.isFile()) {
            const pathToFile = path.join(__dirname, 'secret-folder', `${file.name}`);
            
            fs.stat(pathToFile, (_, stats) => {
                const fileName = path.basename(pathToFile, `${path.extname(pathToFile)}`);
                const fileExt = path.extname(pathToFile).slice(1);
                const fileSize = `${(stats.size / 1024).toFixed(3)}kb`;
                console.log(`${fileName} - ${fileExt} - ${fileSize}`);
            })
        }
    })
});