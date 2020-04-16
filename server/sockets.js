const express = require("express");
const mongoose = require('mongoose');

function runIO(io) {
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });

        socket.on('host-join', () => {
          //const pin = Math.floor(Math.random()*90000) + 10000;
          const pin = 123456;
          socket.join(pin);
          console.log('Game Created with pin:', pin);
          socket.emit('showGamePin', {
            pin: pin
          });
        });

        socket.on('player-join', (params) => {
          if (params.pin == 123456) {
            socket.join(params.pin);
            console.log(`player ${params.players} is now connected`)
          }
        });

        socket.on('message', (message) => {
          console.log(message)
          io.sockets.emit('message', `server: ${message}`)
        });
    });
}

module.exports = runIO;