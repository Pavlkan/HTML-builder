const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');


// ==========================================================================================
// ==========================================================================================

const pathToDist = path.join(__dirname, 'project-dist');
// __________________________________________________________________________

const pathToDistStyle = path.join(__dirname, 'project-dist', 'style.css');
const pathToStyle = path.join(__dirname, 'styles');
// __________________________________________________________________________

const pathToAssets = path.join(__dirname, 'assets'); 
const pathToCopiedAssets = path.join(pathToDist, 'assets'); 
// __________________________________________________________________________

const pathToDistIndex = path.join(__dirname, 'project-dist', 'index.html');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');

function addStyle() {
    fsp.rm(pathToDistStyle, { force: true }).then(() => {
        fs.readdir(pathToStyle, { withFileTypes: true }, (_, files) => {
            let chain = Promise.resolve();
            files.forEach((file) => {
                if (file.isFile()) {
                    const pathToFile = path.join(__dirname, 'styles', `${file.name}`);
                    const fileExt = path.extname(pathToFile).slice(1);
                    if (fileExt === 'css') {
                        chain = chain
                            .then(() => {
                                return fsp.readFile(pathToFile);
                            })
                            .then((data) => {
                                return fsp.appendFile(pathToDistStyle, data);
                            })
                    }   
                }
            })
        });
    });
}

function copyAssets(pathToAssets, pathToCopiedAssets) {
    fs.readdir(pathToAssets, { withFileTypes: true }, (_, items) => {
        items.forEach((item) => {
            if (item.isFile()) {
                const pathToFile = path.join(pathToAssets, item.name);
                const pathToCopiedFile = path.join(pathToCopiedAssets, item.name);
                
                fsp.copyFile(pathToFile, pathToCopiedFile);
                
            } else if (item.isDirectory()) {
                const nestedPath = path.join(pathToAssets, item.name);
                const nestedPathToCopied = path.join(pathToCopiedAssets, item.name);
                fsp.mkdir(nestedPathToCopied).then(() => copyAssets(nestedPath, nestedPathToCopied));
            }
        })
    });
};

function copyContent() {
    return fsp.mkdir(pathToDist)
        .then(() => addStyle())
        .then(() => fsp.mkdir(pathToCopiedAssets))
        .then(() => {
            createIndexHTML();
            copyAssets(pathToAssets, pathToCopiedAssets);
        });
}

function createIndexHTML() {
    fs.readdir(pathToComponents, { withFileTypes: true }, (_, files) => {
        const filesPath = files.map(file => path.join(pathToComponents, file.name));
        const filesContent = filesPath.map(filePath => fsp.readFile(filePath));

        Promise.all([
            fsp.readFile(pathToTemplate),
            ...filesContent, 
        ]).then(([template, ...contents]) => {
            let result = template.toString();
            contents.forEach((content, index) => {
                const contentString = content.toString();
                const fileName = files[index].name.split('.')[0];
                result = result.replace(`{{${fileName}}}`, contentString);
            });
            fsp.appendFile(pathToDistIndex, result);
        })
    })
}

fs.access(pathToDist, (error) => {
    if (error) {
        copyContent();
    } else {
        fsp.rmdir(pathToDist, { recursive: true })
            .then(() => copyContent())
    }
})







