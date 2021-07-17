const express = require("express");
const app = express();
const PORT = 80;

let server = app.listen(PORT, function () {
    console.log("Express server has started on port " + PORT);
});

module.exports = server;
