const fs = require('fs');
const axios = require('axios');
const Path = require('path');

// const downloadImage = async (url, path)=>{
//     let response;
//     try{
//         response = await axios({
//             method: 'get',
//             url: url,
//             responseType: 'stream',
//         });
//     }
//     finally{
//         return new Promise((resolve, reject)=>{
//             if (!response)
//                 reject();
//             response.data.pipe(fs.createWriteStream(path));
//             response.data.on('end', ()=>{
//                 console.log('img downloaded'); 
//                 resolve();
//             });
//             response.data.on('error', ()=>reject());
//         });
//     }  
// }

const downloadImage = async (urls, path)=>{
    for(let url of urls){
        let response;
        try{
            response = await axios({
                timeout: 3000,
                method: 'get',
                url: url,
                responseType: 'stream',
            });
        }
        catch(err){
            console.log('error while downloading img, jumping to next url', url);
            continue;
        }

        return new Promise((resolve, reject)=>{
            if (!response)
                reject();
            response.data.pipe(fs.createWriteStream(path));
            response.data.on('end', ()=>{
                console.log('img downloaded'); 
                resolve();
            });
            response.data.on('error', ()=>reject());
        });
    }
}

const downloadImages = async (urls, dir=__dirname)=>{
    const path = Path.resolve(dir, 'img');
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    const promises = urls.map((url, ind)=>downloadImage(url, path+ind+'.jpg'));
    return Promise.all(promises);
}

module.exports = {downloadImages, downloadImage};