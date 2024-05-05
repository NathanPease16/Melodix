const express = require('express');
const route = express.Router();
const rooms = require('../scripts/rooms');

route.get('/roomCode', (req, res) => {
    const room = rooms.generateRoom(8);
    res.send(room.code).end();
});

module.exports = route;