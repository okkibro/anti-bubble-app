const express = require("express");
const mongoose = require('mongoose');

function runIO(io) {
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });

        socket.on('host-join', () => {
            const pin = Math.floor(100000 + Math.random() * 900000);
            socket.join(pin);
            console.log('Game created with pin:', pin);
            socket.emit('showGamePin', {
                pin: pin
            });
        });

        socket.on('player-join', (params) => {
            socket.join(params.pin);
            console.log(`Player ${params.player} is now connected`)
        });

        socket.on('message', (message) => {
            console.log(message)
            io.sockets.emit('message', `server: ${message}`)
        });
    });
}

module.exports = runIO;