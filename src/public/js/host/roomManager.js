const roomCodeText = document.getElementById('room-code');

(async () => {
    const roomCode = await (await fetch('/roomCode')).text();
    roomCodeText.textContent = roomCode;
})();