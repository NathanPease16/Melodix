const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.render('index');
});

route.get('/host', (req, res) => {
    res.render('host');
});

route.get('/host/select', (req, res) => {
    res.render('hostSelect');
});

route.get('/join', (req, res) => {
    res.render('join');
});

route.get('/host/artist', (req, res) => {
    res.render('artist');
});

route.get('/host/playlist', (req, res) => {
    res.render('playlist');
});

route.get('/quiz', (req, res) => {
    res.render('quiz');
});

module.exports = route;