const songContainer = document.getElementById('song-container');
const submitButton = document.getElementById('submit');

let songs = [];

async function getAndDisplaySongs(playlistId) {
    const response = await fetch(`/playlistSongs/${playlistId}`);

    if (response.ok) {
        songs = await response.json();
        console.log(songs);

        songContainer.innerHTML = '';
        for (const song of songs) {
            song.selected = true;

            const div = document.createElement('div');
            div.className = 'info-card hoverable';

            const unselected = document.createElement('div');
            unselected.className = 'crossed-out';
            unselected.style.display = 'none';

            const p = document.createElement('p');
            p.className = 'info-text';
            p.textContent = song.name;

            div.appendChild(unselected);
            div.appendChild(p);
            songContainer.appendChild(div);
        }
    }
}

submitButton.addEventListener('click', async () => {
    sessionStorage.setItem('songs', JSON.stringify(songs));

    window.location = '/host';
});