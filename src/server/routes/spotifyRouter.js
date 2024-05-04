const express = require('express');
const route = express.Router();
const spotifyApi = require('../scripts/spotify-api');

route.get('/artists/:search', async (req, res) => {
    const artistSearch = req.params.search;

    const artists = await spotifyApi.searchArtists(artistSearch, req.cookies.accessToken);

    res.send(artists.map((artist) => {
        let src = './img/Melodix_1024.png';

        if (artist.images && artist.images.length > 0) {
            src = artist.images[0].url;
        }

        return { name: artist.name, id: artist.id, src };
    })).end();
});

route.get('/albums/:artist', async (req, res) => {
    const artistId = req.params.artist;

    const albums = await spotifyApi.getArtistAlbums(artistId, req.cookies.accessToken); 

    res.send(albums.filter(album => album.album_group != 'appears_on').map((album) => {
        let src = 'Melodix_1024.png';
        if (album.images && album.images.length > 0) {
            src = album.images[0].url;
        }

        return { name: album.name, src, id: album.id, type: album.album_type };
    })).end();
});

route.get('/songs/:albumId', async (req, res) => {
    const albumId = req.params.albumId;

    const songs = await spotifyApi.getAlbumSongs(albumId, req.cookies.accessToken);

    res.send(songs.map(song => ({ name: song.name, uri: song.uri }))).end();
});

module.exports = route;