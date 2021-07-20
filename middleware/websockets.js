require('dotenv').config();

const express = require('express');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 443 });
const connection = require('../database');
var biddingFile = require('../routes/start_bidding');


/////////////////////////////////// /////////////////////////////////
let bidPlaced = false;
let message = {
    type: "noItem",               // biddingStarts, biddingEnds, etc.
    content: {
        currentItem: "",    // current product in auction
        timePassed: 0,      // auction time passed 
        previousBids: [],   // previous bids
        currentPrice: 0,      // current bidded price
        currentUsers: biddingFile.bidding_participants
    }
}
let bidding_time = 15; // 150 seconds

// async function pickItem() {
//     try {
//         global.bidStartId = setInterval(() => {

//             sql = `select * from product where start_bidding = ?`
//             curr = new Date();
//             utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
//             KR_TIME_DIFF = 9 * 60 * 60 * 1000;
//             kr_curr = new Date(utc + (KR_TIME_DIFF));
//             kr_curr.setMilliseconds(0);
//             kr_curr = kr_curr.toISOString().replace(".000Z", "Z");
//             console.log(kr_curr);

//             connection.query(sql, kr_curr, function (err, result) {
//                 result = result[0];
//                 if (result) {
//                     console.log("bidding started!")
//                     message.content.currentItem = result.product_title;
//                     message.content.currentPrice = result.minimum_price;
//                     onBidding();

//                 }

//             })

//         }, 1000)

//     } catch (err) {
//         console.log(err);
//     }

// }

// run the function in every 1 second via setInterval
function onBidding() {
    i = 0;
    message.type = 'onBidding';
    console.log("on bidding function");
    // message.content.currentItem = product_name;
    message.content.timePassed = i;


    global.bidStartId = setInterval(() => {
        i++;
        message.content.timePassed = i;
        broadcast();
        // give clients sockets every second to tell time 

        if (i === bidding_time) {
            global.clearInterval(bidStartId);
            noItem();
        }

    }, 1000)

}



function broadcast() {
    // console.log("broadcasting to users");
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ "type": message.type, "content": message.content }));
            // console.log(biddingFile.bidding_participants.name);
        }
    });
}


function noItem() {
    message.type = "noItem";
}



// wss always running in the background and updating message variable
// check connection
wss.on('connection', function connection(ws) {
    // user validated by the frontend
    console.log("New user participated!");

    ws.on('message', function incoming(data) {
        console.log("New bidding!");
        console.dir(data);
        if (message.type === 'noItem') onBidding();
        else i = 1;

        let parsed = JSON.parse(data);
        // console.dir(data);
        if ((message.type == 'onBidding') && (parseInt(parsed.price) > message.content.currentPrice)) {
            message.content.previousBids.push({ price: parsed.price, user_id: parsed.user });
            message.content.currentPrice = parseInt(parsed.price);
            console.log(message);
        }
    });
});



module.exports = onBidding;




// // check connection
// wss.on('connection', function connection(ws) {
//     console.log('A newws: client connected!');
//     ws.send('Welcome new client!');

//     ws.on('message', function incoming(message) {
//         console.log('received: %s', message);
//         ws.send('Got your message');
//     });
// });



// function broadcast() {
//     console.log("broadcasting to users");
//     // broadcast message to every clients except itself
//     wss.clients.forEach(function each(client) {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//             client.send(message);
//         }
//     });
// }