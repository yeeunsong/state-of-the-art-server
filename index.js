const express = require("express");
const app = express();

const productDetailRoute = require("./routes/product_detail");
const searchProductRoute = require("./routes/search_product");
const router = require("./routes/start_bidding");
// const startBiddingRoute = require("./routes/start_bidding");
const uploadProdctRoute = require("./routes/upload_product");
const loginPageRoute = require("./routes/user_login");
const userPageRoute = require("./routes/user_page");


app.use("/product_detail", productDetailRoute);
// app.use("/search_product", searchProductRoute);
// app.use("/start_bidding", startBiddingRoute);
app.use("/upload_product", uploadProdctRoute);
app.use("/login", loginPageRoute);
// app.use("/mypage", userPageRoute);


// test
app.get("/", function (req, res) {
    console.log("get requested");
    res.send("server connected");
});

module.exports = app;