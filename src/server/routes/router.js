const express = require('express');
const route = express.Router();
const spotifyApi = require('../scripts/spotify-api');

route.get('/', (req, res) => {
    if (!req.cookies.accessToken) {
        res.redirect('/auth/login');
    } else {
        res.render('index');
    }
});

route.get('/artist', (req, res) => {
    if (!req.cookies.accessToken) {
        res.redirect('/auth/login');
    } else {
        res.render('artist');
    }
});

route.get('/quiz', (req, res) => {
    if (!req.cookies.accessToken) {
        res.redirect('/auth/login');
    } else {
        res.render('quiz');
    }
});

route.get('/auth/login', (req, res) => {
    console.log(req);
    const queryParameters = spotifyApi.getAuthQueryParamaters(`${req.protocol}://${req.headers.host}`);
    res.render('login', { href: `https://accounts.spotify.com/authorize/?${queryParameters.toString()}`});
});

route.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    const authOptions = spotifyApi.getAuthOptions(code, `${req.protocol}://${req.headers.host}`);

    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);

    if (response.ok) {
        const tokenData = await response.json();
        res.cookie('accessToken', tokenData.access_token);
        res.redirect('/');
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = route;