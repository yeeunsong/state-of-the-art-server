const express = require('express');
const router = express.Router();
const connection = require('../database');
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

bidding_participants = require('../constants/bid_participants').bidding_participants;


// url for register
// link format: URL_BASE/logout/
router.get('/', (req, res) => {
    var token = req.headers.token;
    // console.log("check in logout - bidding_participants: " + bidding_participants);
    // console.log(token);
    // console.log(JSON.stringify(bidding_participants));

    sql = "select * from userinfo where token = ?";
    connection.query(sql, token, function (err, result) {
        var message = "";
        var ok = 0;

        if (err) {
            console.log(err);
        } else if (!result) {
            message = "non-existing token";
            ok = 0;
        } else {
            message = "logout successful";
            ok = 1;

            var username = result.username;

            // delete username from bidding participants
        }
        res.json({
            'message': message,
            'ok': ok
        });
    });
});


module.exports = router;