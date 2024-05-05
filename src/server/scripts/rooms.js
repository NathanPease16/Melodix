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

    room.players.push( {name: player, choice: -1 } );
}

function updatePlayerChoice(roomCode, player, choice) {
    const room = getRoom(roomCode);

    if (!room) {
        return;
    }

    for (const p of room.players) {
        if (p.name === player) {
            p.choice = choice;
        }
    }
}

function resetPlayerChoices(roomCode) {
    const room = getRoom(roomCode);

    if (!room) {
        return;
    }

    for (const player of room.players) {
        player.choice = -1;
    }
}

function removePlayer(roomCode, player) {
    const room = getRoom(roomCode);

    if (!room) {
        return;
    }

    for (let i = 0; i < room.players.length; i++) {
        if (room.players[i].name === player) {
            room.players.splice(i, 1);
            return;
        }
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
    updatePlayerChoice,
    resetPlayerChoices,
    lockRoom,
    removeRoom,
    activeRooms,
}