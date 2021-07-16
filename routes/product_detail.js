const express = require('express');
const router = express.Router();
var connection = require('../database');
var path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// link format: URL_BASE/product_detail/productid/{product_id}
router.get('/productid/:productid', function (req, res) {
    const product_id = req.params.productid;
    var sql = `select * from product where product_id=?`;

    connection.query(sql, product_id, function (err, result) {
        var resultCode = 404;

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
        }
        res.send({
            'code': resultCode,
            'result': result
        });
    });

});



// link format: URL_BASE/product_detail/productid/{product_id}
router.post('/productid/:productid', function (req, res) {
    const product_id = req.params.productid;
    var sql = `select * from image where product_id=?`;
    connection.query(sql, product_id, function (err, result) {
        filename = result[0].image_name;
        console.log(result[0]);

        if (err) return res.status(500).send(err);
        else res.sendFile(filename, { root: path.join(__dirname, '../public/images') });
    });
});

module.exports = router;