const roomCodeInput = document.getElementById('room-code');
const nameInput = document.getElementById('name');
const joinButton = document.getElementById('join');

joinButton.addEventListener('click', async () => {
    if (!roomCodeInput.value || !nameInput.value) {
        return;
    }

    const response = await fetch(`/valid/${roomCodeInput.value}`);
    const valid = (await response.json()).isValid;

    if (valid) {
        window.location = `/room?code=${roomCodeInput.value}&name=${nameInput.value}`;
    }
});