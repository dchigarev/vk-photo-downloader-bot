const {downloadImages} = require('./modules/downloader');
const Path = require('path');
const fs = require('fs');
const {createArchiveFromDir} = require('./modules/archiver');
const {callApi, uploadFile} = require('./modules/vk-api');
const uid = require('uniqid');
const express = require('express');
const bodyParser = require('body-parser');
const rimraf = require('rimraf');


const dataPath = Path.resolve(__dirname, 'usersData');
const currentRequestsPath = Path.resolve(dataPath, 'currentRequests');

const initStorage = ()=>{
    if (!fs.existsSync(dataPath))
        fs.mkdirSync(dataPath);
    
    if (!fs.existsSync(currentRequestsPath))
        fs.mkdirSync(currentRequestsPath);
}

const getNewReqDir = (dirName=uid())=>{
    return Path.resolve(currentRequestsPath, dirName);
}

const getArchiveWithFiles = async (urls)=>{
    const reqDir = getNewReqDir(),
          imgDir = Path.resolve(reqDir, 'imgs');

    fs.mkdirSync(reqDir);
    fs.mkdirSync(imgDir);

    await downloadImages(urls, imgDir);
    await createArchiveFromDir(reqDir, imgDir, 'imgs.zip');
    
    const archivePath = Path.resolve(reqDir, 'imgs.zip');
    const rmDir = ()=>rimraf(reqDir, ()=>true);
    
    return [archivePath, rmDir];

}

const sortBySize = (sizes)=>{
    sizes.sort((a,b)=>a.width*a.height<b.width*b.height);
    return sizes.map(size=>size.url);
}

const getPhotoAttachments = (message)=>{
    let ans = [];
    for(attachment of message.attachments){
        if (attachment.type!=='photo')
            continue;
        const sizes = attachment.photo.sizes;
        ans.push(sortBySize(sizes));
    }

    for(message of message.fwd_messages || []) {
        ans = ans.concat(getPhotoAttachments(message));
    };
    return ans;
}

const app = express();
app.use(bodyParser());

// app.post('/vk-downloader', (req,res,next)=>{

// })

app.post('/vk-downloader',(req,res,next)=>{
    if (req.body.type==='confirmation'){
        res.send('0b792a75');
        return;
    }
    else
        res.send('ok');
    console.log('get request from vk', req.body);
    handleVkRequest(req.body);
});

const handleVkRequest = async ({object:message, object:{peer_id}})=>{
    const imgUrls = getPhotoAttachments(message);
    callApi('messages.send', {peer_id, message: 'downloading your photos...'});
    const [filePath, removeTmpDir] = await getArchiveWithFiles(imgUrls);


    callApi('messages.send', {peer_id, message: 'uploading archive...'});
    const attachment = await uploadFile({
        path: filePath,
        peer_id,
    });

    const messageResult = await callApi('messages.send', {
        'peer_id': peer_id,
        'attachment': attachment
    });
    removeTmpDir();
}

app.listen(process.env.PORT || 80, ()=>{
    console.log('server is running');
});

initStorage();







