const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function copyFile(file, directory) {
    // get the ext
    const fileName = path.basename(file);
    const source = fs.createReadStream(file);
    // normalize directory with ext
    const dest = fs.createWriteStream(path.resolve(directory, fileName));
    console.log('directory, fileName', directory, fileName, 'path.resolve(directory, fileName)', path.resolve(directory, fileName))
    source.pipe(dest);
    source.on('end', function () { console.log('Succesfully copied'); });
    source.on('error', function (err) { console.log(err); });
};

// function readFileStream(file) {
//     return fs.createReadStream(file);
// }

// function writeFileStream(file) {
//     return fs.createWriteStream(file);
// }

// readFileStream('./src/environment/.env')
//     .pipe(writeFileStream('./dist/src/environment/.env'));
console.log(path.join(__dirname, './src/environment/.env'));
spawn('tsc', { shell: true })
    .on('exit', () => copyFile(
        path.join(__dirname, './src/environment/.env'),
        path.join(__dirname, './dist/src/environment')
    ));
