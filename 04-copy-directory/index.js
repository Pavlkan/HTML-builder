const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathToCopiedFilesDir = path.join(__dirname, 'files-copy');
const pathToFilesDir = path.join(__dirname, 'files');

fs.access(pathToCopiedFilesDir, (error) => {
    if (error) {
        fsp.mkdir(pathToCopiedFilesDir).then(() => copy());
    } else {
        fsp.rmdir(pathToCopiedFilesDir, { recursive: true }).then(() => fsp.mkdir(pathToCopiedFilesDir)).then(() => copy());
    }
})

function copy() {
    fs.readdir(pathToFilesDir, { withFileTypes: true }, (_, files) => {
        files.forEach((file) => {
            if (file.isFile()) {
                const pathToFile = path.join(__dirname, 'files', `${file.name}`);
                const pathToCopiedFile = path.join(__dirname, 'files-copy', `${file.name}`);
                
                fs.copyFile(pathToFile, pathToCopiedFile, () => {});
                
            }
        })
    });
};

