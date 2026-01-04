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

        socket.on('loading', () => {
            if (socket.room.userType === 'host') {
                io.of('/').sockets.forEach(clientSocket => {
                    if (clientSocket.room.code === socket.room.code) {
                        clientSocket.emit('loading');
                    }
                });
            }
        });

        socket.on('question', () => {
            if (socket.room.userType === 'host') {
                io.of('/').sockets.forEach(clientSocket => {
                    if (clientSocket.room.code === socket.room.code) {
                        clientSocket.emit('question');
                    }
                });
            }
        });

        socket.on('submitQuestion', (choice) => {
            const room = rooms.getRoom(socket.room.code);
            let order = 0;

            for (const player of room.players) {
                if (player.choice !== -1) {
                    order++;
                }
            }
            
            rooms.updatePlayerChoice(socket.room.code, socket.room.name, choice, order);
            
            let allSelected = true;
            for (const player of room.players) {
                if (player.choice === -1) {
                    allSelected = false;
                    break;
                }
            }

            if (allSelected) {
                let host;
                io.of('/').sockets.forEach(clientSocket => {
                    if (clientSocket.room.code === socket.room.code && clientSocket.room.userType === 'host') {
                        host = clientSocket;
                    }
                });

                if (host) {
                    host.emit('finishQuestion', room.players);
                }

                rooms.resetPlayerChoices(socket.room.code);
            }
        });

        socket.on('answerRevealed', (correctChoice) => {
            io.of('/').sockets.forEach(clientSocket => {
                if (clientSocket.room.code === socket.room.code) {
                    clientSocket.emit('answerRevealed', correctChoice);
                }
            });
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
