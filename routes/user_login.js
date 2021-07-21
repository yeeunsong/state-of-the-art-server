require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../database');
const base64Img = require('base64-img');
var path = require('path');

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
        } else if (!result) {
            resultCode = 204;
            message = "incorrect email address";
            ok = 0;
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
    var token = (req.headers.token).toString()
    console.log(token);
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
        console.log(result);

        img_path = path.join(__dirname, '../public/avatar_images/' + result.profile_image);
        avatar_img = base64Img.base64Sync(img_path);

        if (err) {
            console.log(err);
        } else if (!result) {
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
                        'avatar': avatar_img,
                        'money': result.nano_bk,
                        'wish': wish,
                        'MyArt': myArt
                        // 'wish': [0, 1],
                        // 'MyArt': [0, 1]
                    },
                    'ok': ok
                });
            })



        }
    });

})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    // you don't have a token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        // the token you have is no longer valid
        req.user = user
        next()
    });
}


function makeToken(email) {
    const user = { name: email }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
}


function insertToken(email, token) {
    sql = "update userinfo set token = ? where email =?"

    connection.query(sql, [token, email], function (err, result) {
        if (err) console.log(error);
        // console.log("token insertion");
    });
}

function getUserWish(username) {
    return new Promise((resolve, reject) => {
        sql = "select * from wishlist where username = ?";
        connection.query(sql, username, function (err, result) {
            if (err) reject(err);
            else {
                resolve(result);
                // console.log(result); 
            }
        });
    })

}

function getUserMyArt(username) {
    return new Promise((resolve, reject) => {
        sql = "select * from myart where username = ?";
        connection.query(sql, username, function (err, result) {
            if (err) reject(err);
            else {
                resolve(result);
                console.log(result);
            }
        });
    })
}


module.exports = router;