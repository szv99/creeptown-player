const guwno = require('socket.io');
const wss = new guwno.Server(7071, { cors: { origin: '*' } })

wss.on('connection', function connection(ws) {

    ws.on('')
})