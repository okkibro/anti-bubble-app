const express = require("express");
const mongoose = require('mongoose');

function runIO(io) {
  var pin;
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });

        socket.on('host-join', () => {
            pin = Math.floor(100000 + Math.random() * 900000);
            socket.join(pin);
            console.log('Game created with pin:', pin);
            socket.emit('showGamePin', pin);
        });

        socket.on('player-join', (params) => {
            if (params.pin === pin) {
              socket.join(params.pin);
              console.log(`Player ${params.player} is now connected`);
            } else {
              console.log('Invalid Pin');
            }
        });

        socket.on('message', (message) => {
            console.log(message)
            io.sockets.emit('message', `server: ${message}`)
        });
    });
}

module.exports = runIO;