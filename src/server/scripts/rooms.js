const validCharacters = '1234567890ABCDEFGHIJ';

let activeRooms = [];

function generateRoom(length) {
    let code = '';

    for (let i = 0; i < length; i++) {
        code += validCharacters[Math.floor(Math.random() * validCharacters.length)];
    }

    const room = { code, locked: false };
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
    lockRoom,
    removeRoom,
}