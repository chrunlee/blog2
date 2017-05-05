var express = require('express');
var router = express.Router();
var articleDao = require('../dao/ArticleDao');
var superagent = require('superagent');
var cheerio = require('cheerio');
var getNotePic = require('../util/getNotePic');

router.get('/',function(req,res){
    res.render('marry/index');
});

module.exports = router;