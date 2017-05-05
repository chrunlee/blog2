//首页路由
var express = require('express');
var fs = require('fs');
var router = express.Router();
var appDao = require('../dao/AppDao');

router.get('/',function(req,res){
    var email = req.session.email;
    var name = email ? email :'登录';
    var href = email ? '' : '/user/login';
    appDao.getList(function(data){
        res.render('index',{
            name : name,
            href : href,
            appList : data
        });
    });
    
});

//首页点赞
router.post('/addlike',function(req,res){
    var id = req.body.id;
    appDao.addLike(id,function(likecount){
        res.end(''+likecount);
    });
});

router.post('/getMsgList',function(req,res){
    fs.readFile('msg.txt',function(err,data){
        if(err)throw err;
        data = data.toString();
        var arrList = data.split('\r\n');
        arrList.reverse();
        res.end(JSON.stringify(arrList));
    });
});
router.post('/saveMsg',function(req,res){
    var content = req.body.content || '';
    var name = req.body.name || '';
    //保存记录到文件中。
    if(content !== ''){
        var d = new Date();
        var neirong = name+'@:'+content+' on '+d.toLocaleString();
        fs.appendFile('msg.txt',neirong+'\r\n');
        var result = {
            success : true,
            msg : '保存成功',
            content : neirong
        };
        res.end(JSON.stringify(result));
    }else{
        var result = {
            success : false,
            msg : '不能为空'
        };
        res.end(JSON.stringify(result));
    }
    
});

module.exports = router;