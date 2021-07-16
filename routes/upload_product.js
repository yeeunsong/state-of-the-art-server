const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
var connection = require('../database');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(fileUpload());
// link format: URL_BASE/upload_product/
router.post('/', function (req, res) {
    var product_id = req.body.product_id;
    var product_title = req.body.product_title;
    var minimum_price = req.body.minimum_price;
    var start_bidding = req.body.start_bidding;
    var user_id = req.body.user_id;
    var product_category = req.body.product_category;
    var product_auth = req.body.product_auth;
    var introduction = req.body.introduction;


    var sql = `insert into product(product_id, product_title, minimum_price, start_bidding, user_id, product_category, product_auth, introduction)
                        values (?,?,?,?,?,?,?,?)`;
    connection.query(sql, [product_id, product_title, minimum_price, start_bidding, user_id, product_category, product_auth, introduction], function (err, result) {
        var resultCode = 404;

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
        }
        res.send({
            'code': resultCode
        });
    });

});


// uploading image files
// components in request: image file & product id
router.post('/upload_image', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;
    var product_id = req.body.product_id;

    // console.log(req.files);
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
        file.mv('public/images/' + img_name, function (err) {

            if (err) return res.status(500).send(err);
            var sql = "INSERT INTO image (product_id, image_name) VALUES (?, ?)";
            var query = connection.query(sql, [product_id, img_name], function (err, result) {

            });
            res.send('insertion successful');
        });
    } else {
        message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        res.json(message);
    }
});

router.get('/', function (req, res) {
    res.send(__dirname);
})

module.exports = router;