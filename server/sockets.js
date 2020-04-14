const express = require("express");
const mongoose = require('mongoose');

function runIO(io) {
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
    });
}

module.exports = runIO;