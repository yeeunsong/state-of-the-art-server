const express = require('express');
const router = express.Router();

var connection = require('../database');
var path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));





module.exports = router;