const roomCodeText = document.getElementById('room-code');
const playerDiv = document.getElementById('players');

const players = [];

const socket = io();

let roomCode;

(async () => {
    roomCode = await (await fetch('/roomCode')).text();
    roomCodeText.textContent = roomCode;

    socket.emit('joinRoom', { code: roomCode });
})();

socket.on('playerJoin', (player) => {
    const playerText = document.createElement('p');
    playerText.textContent = player;

    playerDiv.appendChild(playerText);
    players.push({ name: player, score: 0 });
});

socket.on('playerLeave', (player) => {
    for (const element of playerDiv.children) {
        if (element.textContent === player) {
            element.remove();
        }
    }

    for (let i = 0; i < players.length; i++) {
        if (players[i].name === player) {
            players.splice(i, 1);
        }
    }
});