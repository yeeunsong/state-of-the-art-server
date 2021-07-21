const express = require('express');
const router = express.Router();;
const connection = require('../database');
var path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', function (req, res) {
    console.log("post game requested");
    const token = req.headers.token;
    const money_added = req.body.score;
    var sql = `select * from userinfo where token=?`;
    connection.query(sql, token, function (err, result) {
        var ok = 1;
        if (err) console.log(err);
        else {
            result = result[0];
            username = result.username;
            var new_money = result.nano_bk + money_added;
            var sql = `update userinfo set nano_bk=? where username = ?`;
            connection.query(sql, [new_money, username], function (err2, result) {
                if (err2) {
                    ok = 0;
                    console.log(err);
                } else ok = 1;
            })
        }
        res.send({
            'ok': ok
        });
    });
})

module.exports = router;