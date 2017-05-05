/**
 JSON 格式化 校验 提示 等
**/

var express = require('express');

var router = express.Router();

router.get('/',function(req,res,next){
    res.redirect('/index');
});

router.get('/index',function(req,res,next){
    res.render('json/index');
});

router.post('/beautify',function(req,res,next){
    var content = req.body.content.toString();
    var code = '';
    try{
        var rrr = JSON.parse(content);
        var code = JSON.stringify(rrr, null, 4)
    }catch(e){
        code = e.toString();
        code = '校验未通过,具体位置还不太清楚';
    }
    res.end(code);
});

module.exports = router;