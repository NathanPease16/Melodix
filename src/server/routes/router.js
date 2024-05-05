const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.render('index');
});

route.get('/artist', (req, res) => {
    res.render('artist');
});

route.get('/quiz', (req, res) => {
    res.render('quiz');
});

module.exports = route;