const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const uid = require('uniqid');

const apiToken = 'your_token_here';
const vkBase = 'https://api.vk.com/method/';

const callApi = async (method, params)=>{
    console.log('params: ', params);
    const resp = await axios.get(vkBase+method, {params: {
        ...params,
        access_token: apiToken,
        v: '5.103',
        random_id: Math.floor(Math.random()*10000000),
    }});
    return resp.data;
}

const uploadFile = async ({path, peer_id})=>{
    const data = await callApi('docs.getMessagesUploadServer', {
        type: 'doc',
        peer_id,
    });
    console.log('data', data);
    const {response:{upload_url}} = data;
     
    const form = new FormData();
    form.append('file', fs.createReadStream(path));
    const {data: {file}} = await axios({
        'maxContentLength': Infinity,
        'maxBodyLength': Infinity,
        method: 'post',
        headers: form.getHeaders(),
        url: upload_url.toString(),
        data: form,
    });

    const {response: attachment} = await callApi('docs.save', {
        file: file,
        title: uid(),
    });
    console.log(attachment);
    return `${attachment.type}${attachment.doc.owner_id}_${attachment.doc.id}`;  
}

module.exports = {callApi, uploadFile};