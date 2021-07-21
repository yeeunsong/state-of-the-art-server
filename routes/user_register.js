const express = require('express');
const router = express.Router();
const connection = require('../database');
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// url for register
// link format: URL_BASE/register/
router.post('/', (req, res) => {
    // Authenticate user needed
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const profile_image = Math.floor(Math.random() * 10) + '.jpg';
    console.log('post register requested');

    sql = "insert into userinfo (username, password, email, profile_image, nano_bk) values (?,?,?, ?, ?)";
    connection.query(sql, [username, password, email, profile_image, 500], function (err, result) {
        var message = "";
        var resultCode = 404;
        var ok = "";

        if (err) {
            console.log(err);
            ok = 0;
        } else {
            resultCode = 200;
            message = "register successful";
            ok = 1;
        }
        res.json({
            'code': resultCode,
            'message': message,
            'ok': ok
        });
    });
});


module.exports = router;