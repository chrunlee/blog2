var express = require('express');

var router = express.Router();
var superagent = require('superagent');

router.get('/',function(req,res){
    res.redirect('/other/index');
});
router.get('/index',function(req,res){
    res.render('other/index');
});
router.get('/miaopai',function(req,res){
    res.render('other/miaopai');
});
router.post('/miaopai/post',function(req,res){
    var url = req.body.url;
    
    url = url.substring(url.lastIndexOf('/')+1,url.lastIndexOf('.'));
    url = 'http://gslb.miaopai.com/stream/'+url+'.json?token=';
    superagent.get(url).end(function(err,sres){
        var text = sres.text;
        var obj = JSON.parse(text);
        var host = obj.result[0].host;
        var path = obj.result[0].path;
        var backUrl = 'http://'+host+path;
        res.end(backUrl);
    });
    
});
module.exports = router;