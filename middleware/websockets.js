const express = require('express');
const WebSocket = require('ws');
let server = require('../server');



const wss = new WebSocket.Server({ server });

// check connection
wss.on('connection', function connection(ws) {
    console.log('A newws: client connected!');
    ws.send('Welcome new client!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('Got your message');
    });
});


/////////////////////////////////// /////////////////////////////////

let bidPlaced = false;
let message = {
    type: 'noItem',
    content: {
        currentItem: [],
        degree: 0,
        previousBidsUser: [],
        current_price: 0,
    },
    private: {
        previousBids: [],
    }
}



    =

    function broadcast() {
        // broadcast message to every clients except itself
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

// 
async function pickItem() {
    try {
        let check = await Items.find({ bidded: false }).sort({ start_bid_date: 1 }).limit(1);
        let noItemId;
        if (check.length > 0) {
            message.content.currentItem = check;
            message.content.previousBidsUser = [];
            message.content.currentItem[0].start_bid_date;
            // is there remain time for the current item to be started
            if (message.content.currentItem[0].start_bid_date >= new Date().getTime()) {
                inWait();
            }
            else {
                bidLoop();
            }
            message.content.current_price = check[0].price;
        }
        else {
            // there is no item in queue to bid
            noItem();
        }
    }
    catch (err) {
        console.log(err);
    }
}

pickItem();


function bidLoop() {
    let i = 0;
    function bidStart() {
        i = 0;
        message.type = 'bidStart';
        message.content.degree = i;
        broadcast();
        global.bidStartId = setInterval(() => {
            message.content.degree = i;
            // 360 is the circle timer degree
            if (bidPlaced) {
                global.clearInterval(bidStartId);
                bidPlaced = false;
                bidStart();
                broadcast();
            }
            i++;
        }, 30);
    }
}
/////////////////////////////////////////////////////////////////////

