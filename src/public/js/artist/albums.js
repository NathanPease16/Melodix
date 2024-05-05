const submitButton = document.getElementById('submit');
const albumContainer = document.getElementById('album-container');

const content = document.getElementById('content');
const loading = document.getElementById('loading');

let albums;

async function getAndDisplayAlbums(artistId) {
    const response = await fetch(`/albums/${artistId}`);

    if (response.ok) {
        albums = await response.json();

        albumContainer.innerHTML = '';
        for (const album of albums) {
            album.selected = true;

            const div = document.createElement('div');
            div.className = 'info-card hoverable';

            const unselected = document.createElement('div');
            unselected.className = 'crossed-out';
            unselected.style.display = 'none';

            const img = document.createElement('img');
            img.src = album.src;
            img.className = 'info-image';

            const p = document.createElement('p');
            p.className = 'info-text';
            p.textContent = album.name;

            div.appendChild(unselected);
            div.appendChild(img);
            div.appendChild(p);
            albumContainer.appendChild(div);

            div.addEventListener('click', () => {
                album.selected = !album.selected;
                if (album.selected) {
                    unselected.style.display = 'none';
                } else {
                    unselected.style.display = '';
                }
            });
        }
    }
}

submitButton.addEventListener('click', async () => {
    let songs = [];

    content.style.display = 'none';
    loading.style.display = '';

    for (const album of albums) {
        if (!album.selected) {
            continue;
        }

        const response = await fetch(`/songs/${album.id}`);

        if (response.ok) {
            songs = [...songs, ...(await response.json())];
        }
    }

    sessionStorage.setItem('songs', JSON.stringify(songs));

    window.location = '/host';
});