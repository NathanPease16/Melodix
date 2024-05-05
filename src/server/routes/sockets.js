const rooms = require('../scripts/rooms');

function establishSockets(app) {
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    io.on('connection', async (socket) => {

        const splitRoute = socket.handshake.headers.referer.split('/');
        if (splitRoute.length >= 4) {
            const userType = splitRoute[3] === 'host' ? 'host' : 'player';

            socket.room = { userType };
        }

        socket.on('joinRoom', (userInfo) => {
            if (!rooms.roomIsJoinable(userInfo.code)) {
                return;
            }

            socket.room.code = userInfo.code;

            if (!userInfo.name) {
                socket.room.name = 'host';
            } else {
                socket.room.name = userInfo.name;
                rooms.addPlayer(userInfo.code, userInfo.name);

                io.of('/').sockets.forEach(clientSocket => {
                    if (clientSocket.room.code === userInfo.code && clientSocket.room.userType === 'host') {
                        clientSocket.emit('playerJoin', userInfo.name);
                    }
                });
            }
        });

        socket.on('disconnect', (reason) => {
            if (socket.room.userType === 'host') {
                rooms.removeRoom(socket.room.code);
            } else {
                rooms.removePlayer(socket.room.code, socket.room.name);

                io.of('/').sockets.forEach(clientSocket => {
                    if (clientSocket.room.code === socket.room.code && clientSocket.room.userType === 'host') {
                        clientSocket.emit('playerLeave', socket.room.name);
                    }
                });
            }
        });
    });

    return server;
}

module.exports = {
    establishSockets,
}