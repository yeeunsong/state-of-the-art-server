const express = require('express');
const router = express.Router();;
const connection = require('../database');
var path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));




// link format: URL_BASE/drawings/wishlist
router.post('/wishlist', function (req, res) {
    const list = req.body.data;
    console.log(req.body);
    // const list = [0, 1, 2];
    const token = req.headers.token;
    var ok = 1;
    var sql = `select * from userinfo where token=?`;
    connection.query(sql, token, function (err, result) {
        if (err) console.log(err);
        else {
            result = result[0];
            username = result.username;

            list.forEach(element => {
                var sql = `insert into wishlist (imagename, username ) values(?,?)`;
                console.log("inserted element: " + element);
                connection.query(sql, [element, username], function (err, result) {
                    if (err) {
                        ok = 0;
                        console.log(err);
                    } else ok = 1;
                })
            });
        }
    })
    res.send({
        'ok': ok
    });

})



// link format: URL_BASE/drawings/myart
router.post('/myart', function (req, res) {
    const image = 9
    // const list = [0, 1, 2];
    const token = req.headers.token;
    const price = req.body.price;
    var sql = `select * from userinfo where token=?`;
    connection.query(sql, token, function (err, result) {
        var ok = 0;
        if (err) console.log(err);
        else {
            result = result[0];
            username = result.username;
            var sql = `insert into myart (imagename, username ) values(?,?)`;
            connection.query(sql, [9, username], function (err, result) {
                if (err) {
                    ok = 0;
                    console.log(err);
                } else ok = 1;
            });

            var new_money = result.nano_bk - price;
            var sql = `update userinfo set nano_bk=? where username = ?`;
            connection.query(sql, [new_money, username], function (err, result) {
                if (err) {
                    ok = 0;
                    console.log(err);
                } else ok = 1;
            })
        }
        res.send({
            'ok': ok
        });
    });
});



module.exports = router;