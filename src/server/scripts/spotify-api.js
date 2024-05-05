const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

function getAuthQueryParamaters(host) {
    const scope = "streaming user-read-email user-read-private playlist-read-private user-modify-playback-state";

    const authQueryParameters = new URLSearchParams({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri: `${host}/auth/callback`,
        state: 'LSKDJFH34sdkljfh',
    });

    return authQueryParameters;
}

function getAuthOptions(code, host, refreshToken = null) {
    const bodyParams = {
        redirect_uri: `${host}/auth/callback`,
        grant_type: refreshToken ? 'refresh_token' : 'authorization_code',
    };

    if (refreshToken) {
        bodyParams.refresh_token = refreshToken;
    } else {
        bodyParams.code = code;
    }
    
    /*
    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            redirect_uri: `${host}/auth/callback`,
            grant_type: 'authorization_code',
        }),
   }
   */

    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(bodyParams),
    }

    return authOptions;
}

async function searchArtists(artistSearch, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistSearch)}&type=artist&limit=5`, {
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
    getAuthQueryParamaters,
    getAuthOptions,
    searchArtists,
    getArtistAlbums,
    getAlbumSongs,
}