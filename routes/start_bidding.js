const express = require('express');
const router = express.Router();

const onBidding = require('../middleware/websockets');
const connection = require('../database');
var path = require('path');

let bidding_participants = [];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/// import function from middleware/websockets.js

// onBidding();

// link format: URL_BASE/start_bidding/productid/{product_id}
// Getting access to the specific product bidding page
router.get('/productid/:productid', function (req, res) {
    const product_id = req.params.productid;
    var sql = `select * from product where product_id=?`;

    connection.query(sql, product_id, function (err, result) {
        result = result[0];
        var resultCode = 404;
        var message = "";
        var ok = 0;
        var data = "";

        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr = new Date(utc + (KR_TIME_DIFF));
        const bidding_duration = 100 * 60 * 1000; // 100minutes
        const bid_starts = result.start_bidding;
        const bid_ends = new Date(bid_starts.getTime() + bidding_duration)
        // console.log("kr_curr: " + kr_curr);
        // console.log("bid_starts: " + bid_starts);
        // console.log("bid ends: " + bid_ends);

        // if (bid_starts > kr_curr || bid_ends < kr_curr) {
        if (bid_starts > kr_curr) {
            // page unavailable before the bidding start time || after the bid ends
            resultCode = 401;
            message = "Page not accessible";
            ok = 0;

        } else {
            // Start bidding!
            resultCode = 200;
            message = "Bidding starts!";
            ok = 1;
            // Product information is in the query response:
            // Product username, minimum_price, product_info

            // userinfo에서 정보 받기
        }

        res.send({
            'code': resultCode,
            'message': message,
            'ok': ok,
            'data': {
                'currentprice': result.minimum_price,
                'title': result.product_title,
                'context': result.introduction,
                'picture': null,
                // NEED TO INSERT PICTURE CODE!
                'fasttime': result.start_bidding,
                'currentUsers': bidding_participants,
            }
        });
    });
});


// link format: URL_BASE/start_bidding/productid/{product_id}
// Post request for PARTICIPATING IN THE BIDDING
// Show the bidding page to only people who requested for the participation
// return information of USERNAME, AGE, PROFIEIMAGE of all participating users
router.get('/productid/:productid/participate', function (req, res) {
    // receive username 
    const product_id = req.params.productid;
    const user_token = req.headers.token;
    // console.log(user_token);
    var sql = `select * from userinfo where token=?`;
    var ok = 0;

    connection.query(sql, user_token, function (err, result) {
        var resultCode = 404;
        // console.log(result);
        result = result[0];
        participantInfo = { 'name': result.username, 'avatar': null };
        bidding_participants.push(participantInfo);
        // need to change avatar image foramt
        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            ok = 1;
        }
        res.send({
            'code': resultCode,
            'currentUsers': bidding_participants,
            'ok': ok
        });
        // needs check of bidding_participants format
    });
});


module.exports = router;