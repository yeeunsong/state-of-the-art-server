const express = require("express");
const app = express();
const PORT = 80;
/////////////////////////////////
const WebSocket = require('ws');
/////////////////////////////////


const productDetailRoute = require("./routes/product_detail");
const searchProductRoute = require("./routes/search_product");
const startBiddingRoute = require("./routes/start_bidding");
const uploadProdctRoute = require("./routes/upload_product");
const userPageRoute = require("./routes/user_page");


app.use("/product_detail", productDetailRoute);
// app.use("/search_product", searchProductRoute);
app.use("/start_bidding", startBiddingRoute);
app.use("/upload_product", uploadProdctRoute);
// app.use("/user_page", userPageRoute);


var server = app.listen(PORT, function () {
    console.log("Express server has started on port " + PORT)
});
/////////////////////////////////

const wss = new WebSocket.Server({ server: server });


wss.on('connection', function connection(ws) {
    console.log('A new client connected!');
    ws.send('Welcome new client!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('Got your message');
    });
});
/////////////////////////////////



app.get('/', function (req, res) {
    res.send(__dirname);
})

module.exports.server = server;
