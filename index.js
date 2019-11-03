const http = require('http');

const server = http.createServer();

server.on('request', (req, res)=>{
    res.end('0b792a75');
});

server.listen(process.env.PORT || 3000, ()=>console.log('server is running'));