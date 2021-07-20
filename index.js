const express = require("express");
const app = express();
const cors = require('cors');


const productDetailRoute = require("./routes/product_detail");
const startBiddingRoute = require("./routes/start_bidding");
const uploadProdctRoute = require("./routes/upload_product");
const loginPageRoute = require("./routes/user_login");
const logoutPageRoute = require("./routes/user_logout");
const registerPageRoute = require("./routes/user_register");
const userPageRoute = require("./routes/user_page");

app.use(cors());

app.use("/product_detail", productDetailRoute);
app.use("/start_bidding", startBiddingRoute);
app.use("/upload_product", uploadProdctRoute);
app.use("/login", loginPageRoute);
app.use("/logout", logoutPageRoute);
app.use("/register", registerPageRoute);
// app.use("/mypage", userPageRoute);


// test
app.get("/", function (req, res) {
    console.log("get requested");
    res.send("server connected");
});

module.exports = app;