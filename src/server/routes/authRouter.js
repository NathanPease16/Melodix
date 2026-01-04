const express = require('express');
const route = express.Router();
const spotifyApi = require('../scripts/spotify-api');

route.get('/auth/login', (req, res) => {
    const queryParameters = spotifyApi.getAuthQueryParamaters(`${req.protocol}s://${req.headers.host}`);
    res.render('login', { href: `https://accounts.spotify.com/authorize/?${queryParameters.toString()}`});
});

route.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    const authOptions = spotifyApi.getAuthOptions(code, `${req.protocol}://${req.headers.host}`);

    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);

    if (response.ok) {
        const tokenData = await response.json();
        res.cookie('accessToken', tokenData.access_token, { maxAge: 45 * 60 * 1000 });
        res.cookie('refreshToken', tokenData.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.redirect('/');
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = route;
