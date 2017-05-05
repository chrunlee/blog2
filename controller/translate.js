/**
    翻译工具的控制类
***/

var express = require('express');
var superagent = require('superagent');
var md5 = require('../util/md5');

var config = {
    appid : '20160804000026244',
    key :'bL_37TDX3DV5u6_RxnB8'
};

var router = express.Router();

router.get('/index',function(req,res,next){
    res.render('translate/index');
});

router.post('/post',function(req,res,next){
    var q = req.body.query;
    console.log(q);
    var appid = config.appid,key = config.key,salt = (new Date).getTime();
    var sign = md5(appid + q + salt + key);
    var from = 'en',to = 'zh';
    superagent.post('http://api.fanyi.baidu.com/api/trans/vip/translate')
    .send({
        q: q,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
    }).
    end(function(err,res){
        console.log(res.text);
    });
});

module.exports = router;