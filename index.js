const http = require('http');

const server = http.createServer();

server.on('request', (req, res)=>{
    res.end('0b792a75');
});

server.listen(80, ()=>console.log('server is running'));