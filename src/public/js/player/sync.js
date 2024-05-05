const roomCodeText = document.getElementById('room-code');

const socket = io();

const urlSearchParams = new URLSearchParams(window.location.search);
const code = urlSearchParams.get('code');
const name = urlSearchParams.get('name');

socket.emit('joinRoom', { name, code });
roomCodeText.textContent = code;