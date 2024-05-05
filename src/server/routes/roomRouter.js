const express = require('express');
const route = express.Router();
const rooms = require('../scripts/rooms');

route.get('/room', (req, res) => {
    res.render('room');
});

route.get('/roomCode', (req, res) => {
    const room = rooms.generateRoom(8);
    res.send(room.code).end();
});

route.get('/valid/:code', (req, res) => {
    const room = rooms.getRoom(req.params.code);

    if (!room || room.locked) {
        res.send({ isValid: false }).end();
        return;
    }

    res.send({ isValid: true }).end();
});

module.exports = route;