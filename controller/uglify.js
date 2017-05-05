//该文件对uglify 进行跳转控制。
var express = require('express');
var UglifyJS = require('uglify-js');
var appDao = require('../dao/AppDao');
var router = express.Router();

router.get('/',function(req,res,next){
    res.render('uglify');
});
router.post('/post',function(req,res,next){
    var content = req.body.content.toString();
    if(content && content != ''){
        //处理压缩JS
        content = UglifyJS.minify(content,{
            fromString : !!1,
            mangle : true
        });
        res.end(content.code);
    }else{
        res.end({
            success : false,
            msg : '传参错误'
        });
    }
});
module.exports = router;