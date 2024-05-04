const artistInput = document.getElementById('artist');
const artistText = document.getElementById('artist-text');
const artistSubmit = document.getElementById('submit-artist');
const artistSelect = document.getElementById('artist-select');

let artist = {};

artistInput.addEventListener('input', async () => {
    if (artistInput.value.trim() === '') {
        artist = {};
        artistText.textContent = 'Artist: ';
        return;
    }

    const response = await fetch(`/artists/${artistInput.value}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        artist = await response.json();
        if (artist.id) {
            artistText.textContent = `Artist: ${artist.name}`;
        } else {
            artistText.textContent = 'Artist: ';
        }
    }
});

artistSubmit.addEventListener('click', async () => {
    if (!artist.id) {
        return;
    }

    artistSelect.style.display = 'none';
    albumSelect.style.display = '';

    getAlbums();
});