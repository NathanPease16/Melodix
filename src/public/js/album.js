const albumSelect = document.getElementById('album-select');
const albumsContainer = document.getElementById('albums');
const submitAlbums = document.getElementById('submit-albums');
const startContainer = document.getElementById('start-container');

const checkboxes = [];
const albums = [];
let songs = [];

async function getAlbums() {
    const response = await fetch(`/albums/${artist.id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const albums = await response.json();

        albumsContainer.innerHTML = '';
        for (const album of albums) {
            const div = document.createElement('div');
            div.className = 'album';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = album.id;
            checkbox.checked = true;

            checkboxes.push(checkbox);

            const img = document.createElement('img');
            img.src = album.image;
            
            const name = document.createElement('p');
            name.textContent = album.name;

            div.appendChild(checkbox);
            div.appendChild(img);
            div.appendChild(name);
            albumsContainer.appendChild(div);
        }
    }
}

submitAlbums.addEventListener('click', async () => {
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            albums.push(checkbox.id);
        }
    }

    for (const album of albums) {
        const response = await fetch(`/songs/${album}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        songs = [...songs, ...(await response.json()).filter(song => song.url !== null)];
    }

    console.log(songs);

    albumSelect.style.display = 'none';
    startContainer.style.display = '';
});
