const artistSearch = document.getElementById('artist-search');
const dropdown = document.getElementById('dropdown');

artistSearch.addEventListener('input', async () => {
    if (artistSearch.value.trim() === '') {
        dropdown.style.display = 'none';
        return;
    }

    const response = await fetch(`/artists/${artistSearch.value}`);

    if (response.ok) {
        const artists = await response.json();
        dropdown.style.display = '';
        dropdown.innerHTML = '';

        for (const artist of artists) {
            const div = document.createElement('div');
            div.className = 'info-card hoverable';

            const img = document.createElement('img');
            img.src = artist.src;
            img.className = 'info-image';

            const p = document.createElement('p');
            p.className = 'info-text';
            p.textContent = artist.name;

            div.appendChild(img);
            div.appendChild(p);
            dropdown.appendChild(div);

            div.addEventListener('click', async () => {
                dropdown.style.display = 'none';
                await getAndDisplayAlbums(artist.id);
            });
        }
    }
});