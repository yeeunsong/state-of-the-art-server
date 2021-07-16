const express = require('express');
const WebSocket = require('ws');
const server = require('./index');

const wss = new WebSocket.Server({ server: server });


wss.on('connection', function connection(ws) {
    console.log('A new client connected!');
    ws.send('Welcome new client!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('Got your message');
    });
});

