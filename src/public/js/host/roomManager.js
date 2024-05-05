const roomCodeText = document.getElementById('room-code');
const playerDiv = document.getElementById('players');

const players = [];

const socket = io();

(async () => {
    const roomCode = await (await fetch('/roomCode')).text();
    roomCodeText.textContent = roomCode;

    socket.emit('joinRoom', { code: roomCode });
})();

socket.on('playerJoin', (player) => {
    const playerText = document.createElement('p');
    playerText.textContent = player;

    playerDiv.appendChild(playerText);
    players.push(player);
});

socket.on('playerLeave', (player) => {
    for (const element of playerDiv.children) {
        if (element.textContent === player) {
            element.remove();
        }
    }

    if (players.includes(player)) {
        players.splice(players.indexOf(player), 1);
    }
});