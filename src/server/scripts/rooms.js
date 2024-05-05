const validCharacters = '1234567890ABCDEFGHIJ';

let activeRooms = [];

function generateRoom(length) {
    let code = '';

    for (let i = 0; i < length; i++) {
        code += validCharacters[Math.floor(Math.random() * validCharacters.length)];
    }

    const room = { code, players: [], locked: false };
    activeRooms.push(room);

    return room;
}

function getRoom(roomCode) {
    for (const activeRoom of activeRooms) {
        if (activeRoom.code === roomCode) {
            return activeRoom;
        }
    }

    return undefined;
}

function roomIsJoinable(roomCode) {
    const room = getRoom(roomCode);

    return !(!room || room.locked);
}

function addPlayer(roomCode, player) {
    const room = getRoom(roomCode);

    if (!room) {
        return;
    }

    room.players.push(player);
}

function removePlayer(roomCode, player) {
    const room = getRoom(roomCode);

    if (!room) {
        return;
    }

    if (room.players.includes(player)) {
        room.players.splice(room.players.indexOf(player), 1);
    }
}

function lockRoom(roomCode) {
    const room = getRoom(roomCode);

    if (!room) {
        return;
    }

    room.locked = true;
}

function removeRoom(roomCode) {
    const room = getRoom(roomCode);

    if (room) {
        activeRooms.splice(activeRooms.indexOf(room), 1);
    }
}

module.exports = {
    generateRoom,
    getRoom,
    roomIsJoinable,
    addPlayer,
    removePlayer,
    lockRoom,
    removeRoom,
    activeRooms,
}