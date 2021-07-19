require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../database');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// url for login
// link format: URL_BASE/login/
router.post('/', (req, res) => {
    // Authenticate user needed
    const email = req.body.email;
    const password = req.body.password;
    console.log('post requested');

    sql = "select * from userinfo where email = ? limit 1";
    connection.query(sql, email, function (err, result) {
        var message = "";
        var resultCode = 404;
        var token = "";
        var ok = "";
        result = result[0];

        if (err) {
            console.log(err);
        } else if (password !== result.password) {
            resultCode = 204;
            message = "incorrect password";
            ok = 0;
        } else if (result.length === 0) {
            resultCode = 204;
            message = "non-existing account";
            ok = 0;
        } else {
            resultCode = 200;
            message = "log-in successful";
            ok = 1;
            token = makeToken(email);
            insertToken(email, token);
        }
        res.json({
            'code': resultCode,
            'message': message,
            'token': token,
            'ok': ok
        });
    });
});


router.get('/request_userinfo', function (req, res) {
    const token = req.headers.token;
    // console.log(req.headers);
    // console.log(token);
    sql = "select * from userinfo where token = ?";
    connection.query(sql, token, function (err, result) {
        var message = "";
        var resultCode = 404;
        var ok = "";
        var wish = "";
        var myArt = "";
        result = result[0];

        if (err) {
            console.log(err);
        } else if (result.length === 0) {
            resultCode = 204;
            message = "non-existing token";
            ok = 0;

            res.json({
                'code': resultCode,
                'message': message,
                'ok': ok
            });

        } else {
            resultCode = 200;
            message = "request successful";
            ok = 1;
            var username = result.username;
            // console.log(username);

            // due to asynchronous character of nodejs
            getUserWish(username).then(wishResult => {
                // console.log('result received: ' + wishResult);
                wish = wishResult;
                return getUserMyArt(username)
            }).then(myArtResult => {
                // console.log('result received: ' + myArtResult);
                myArt = myArtResult;
            }).then(response => {
                res.json({
                    'code': resultCode,
                    'message': message,
                    'data': {
                        'username': result.username,
                        'avatar': result.profile_image,
                        'money': result.nano_bk,
                        'wish': wish,
                        'MyArt': myArt
                    },
                    'ok': ok
                });
            })



        }
    });

})




module.exports = router;