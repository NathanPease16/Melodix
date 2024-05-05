const linkSearch = document.getElementById('link-search');
const linkDropdown = document.getElementById('link-dropdown');

linkSearch.addEventListener('input', async () => {
    if (linkSearch.value.trim() === '') {
        linkDropdown.style.display = 'none';
        return;
    }

    const response = await fetch(`/playlistId/${linkSearch.value.split('/')[4]}`);

    const playlist = await response.json();

    if (playlist.id) {
        linkDropdown.style.display = '';
        linkDropdown.innerHTML = '';

        const div = document.createElement('div');
        div.className = 'info-card hoverable';

        const img = document.createElement('img');
        img.src = playlist.src;
        img.className = 'info-image';

        const p = document.createElement('p');
        p.className = 'info-text';
        p.textContent = playlist.name;

        div.appendChild(img);
        div.appendChild(p);
        linkDropdown.appendChild(div);

        div.addEventListener('click', async () => {
            linkDropdown.style.display = 'none';
            await getAndDisplaySongs(playlist.id);
        });
    }
});