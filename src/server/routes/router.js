const express = require('express');
const route = express.Router();
const spotifyApi = require('../scripts/spotify-api');

route.get('/', (req, res) => {
    res.render('index.ejs');
});

route.get('/songs/:albumId', async (req, res) => {
    const albumId = req.params.albumId;

    const accessToken = await spotifyApi.getAccessToken();
    const songs = await spotifyApi.getAlbumSongs(albumId, accessToken.access_token);

    res.send(songs.map(song => ({ name: song.name, url: song.preview_url }))).end();
});

route.get('/artists/:search', async (req, res) => {
    const artistSearch = req.params.search;

    const accessToken = await spotifyApi.getAccessToken();
    const artists = await spotifyApi.searchArtists(artistSearch, accessToken.access_token);

    if (artists.length > 0) {
        res.send({ name: artists[0].name, id: artists[0].id }).end();
    } else {
        res.send({}).end();
    }
});

route.get('/albums/:artist', async (req, res) => {
    const artistId = req.params.artist;

    const accessToken = await spotifyApi.getAccessToken();
    const albums = await spotifyApi.getArtistAlbums(artistId, accessToken.access_token); 

    res.send(albums.filter(album => album.album_group != 'appears_on').map(album => ({ name: album.name, image: album.images[0].url, id: album.id }))).end();
});

module.exports = route;