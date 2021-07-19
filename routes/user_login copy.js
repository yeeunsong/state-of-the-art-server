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
        } else {
            resultCode = 200;
            message = "log-in successful";
            ok = 1;
            var username = result.username;
            console.log(username);


            wish = getUserWish(username);
            myArt = getUserMyArt(username);

            console.log(wish, myArt);
        }
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
        console.log("token insertion");
    });
}

function getUserWish(username) {
    sql = "select * from wishlist where username = ?";
    connection.query(sql, username, function (err, result) {
        if (err) console.log(error);
        console.log(result);
        return result;
    });
}

function getUserMyArt(username) {
    sql = "select * from myart where username = ?";
    connection.query(sql, username, function (err, result) {
        if (err) console.log(error);
        console.log(result);
        return result;
    });
}

module.exports = router;