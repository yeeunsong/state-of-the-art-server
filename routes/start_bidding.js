const express = require('express');
const router = express.Router();
const base64Img = require('base64-img');

const onBidding = require('../middleware/websockets');
const connection = require('../database');
var path = require('path');

bidding_participants = require('../constants/bid_participants').bidding_participants;

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

        var curr = new Date();
        var utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        var KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        var kr_curr = new Date(utc + (KR_TIME_DIFF));
        var bidding_duration = 100 * 60 * 1000; // 100minutes
        var bid_starts = result.start_bidding;
        var bid_ends = new Date(bid_starts.getTime() + bidding_duration)
        // var img_path = path.join(__dirname, '../public/product_images/' + result.image_name);
        // var product_img = base64Img.base64Sync(img_path);

        // if (bid_starts > kr_curr) {
        //     // page unavailable before the bidding start time || after the bid ends
        //     resultCode = 401;
        //     message = "Page not accessible";
        //     ok = 0;

        // } else {
        // Start bidding! 
        resultCode = 200;
        message = "Bidding starts!";
        ok = 1;

        //     // userinfo에서 정보 받기
        // }
        console.log("participate request for: " + product_id);
        console.log(result);
        res.send({
            'code': resultCode,
            'message': message,
            'ok': ok,
            'data': {
                'currentprice': result.minimum_price,
                'title': result.product_title,
                'context': result.introduction,
                'src': result.image_name,
                'subtitle': result.subTitle,
                'engTitle': result.engTitle,
                'date': result.start_bidding,
                'currentUsers': bidding_participants,
                'id': product_id
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

        img_path = path.join(__dirname, '../public/avatar_images/' + result.profile_image);

        // console.log(img_path)

        avatar_img = base64Img.base64Sync(img_path);

        // console.log(avatar_img);
        participantInfo = { 'name': result.username, 'avatar': avatar_img };
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
        ////////////////////////////////////
        console.log("check in bidding - bidding_participants: " + bidding_participants[0].name);
        // needs check of bidding_participants format
    });
});

// exports.bidding_participants = bidding_participants;
module.exports = router;