const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

async function getAccessToken() {
    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    }

    return await fetch('https://accounts.spotify.com/api/token', authOptions).then(res => res.json());
}

async function getArtistSongs(artistId, accessToken) {
    const albumResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    if (albumResponse.ok) {
        const albums = await albumResponse.json();
        let allSongs = [];

        for (const album of albums.items) {
            const songsResponse = await fetch(album.href, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            
            const tracks = (await songsResponse.json()).tracks.items;

            allSongs = [...allSongs, ...tracks];
        }

        const songs = [];

        //  Remove any duplicate songs (which can happen with re-releases of albums)
        allLoop: for (const song of allSongs) {
            for (const s of songs) {
                if (s.name === song.name) {
                    continue allLoop;
                }
            }

            songs.push(song);
        }

        return songs;
    } else {

    }
}

async function searchArtists(artistSearch, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistSearch)}&type=artist`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    return (await response.json()).artists.items;
}


async function getArtistAlbums(artistId, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    return (await response.json()).items;
}

async function getAlbumSongs(albumId, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    return (await response.json()).tracks.items;
}

module.exports = {
    getAccessToken,
    getArtistSongs,
    searchArtists,
    getArtistAlbums,
    getAlbumSongs,
}