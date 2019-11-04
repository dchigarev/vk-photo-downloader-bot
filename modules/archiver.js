const Archive = require('archiver');
const Path = require('path');
const fs = require('fs');

const createArchiveFromDir = async (outputPath, targetPath, archName='imgs.zip')=>{
    const archFile = fs.createWriteStream(Path.resolve(outputPath, archName));
    const archive = Archive.create('zip');

    archive.pipe(archFile);
    archive.directory(targetPath, false);
    await archive.finalize();

    // return new Promise((resolve, reject)=>{
    //     archFile.on('end', ()=>resolve());
    //     archFile.on('error', ()=>reject());
    // });
}

module.exports = {createArchiveFromDir};

