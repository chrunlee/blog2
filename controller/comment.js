var express = require('express');
var router = express.Router();
var commentDao = require('../dao/CommentDao');

router.post('/getList',function(req,res){
    var appid = req.body.appid;
    var page = req.body.page || 1,
        rows = req.body.rows || 10;
    page = parseInt(page,10);
    rows = parseInt(rows,10);
    var start = (page-1)*rows;
    commentDao.getList(appid,start,rows,function(data,total){
        var resData = {
            total : total,
            rows : data
        };
        res.end(JSON.stringify(resData));
    });
});

router.post('/saveComment',function(req,res){
    var data = req.body;
    //校验并添加
    var d = new Date();
    data.createtime = d;
    data.id = require('../util/uuid')();
    commentDao.saveComment(data,function(){
        //插入成功
        res.end('评论成功');
    });
});

router.post('/getNewList',function(req,res){
    var num = req.body.num;
    num = num || 10;
    num = parseInt(num,10);
    commentDao.getNewList(num,function(err,data){
        var list = data[0];
        var result = JSON.stringify(list);
        res.end(result);
    });
});



module.exports = router;