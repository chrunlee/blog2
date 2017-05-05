/**
控制LESS 编译模块的路由
***/
var express = require('express');

var router = express.Router();

router.get('/',function(){
    res.redirect('/index');
});

router.get('/index',function(req,res){
    res.render('');
});


router.post('/post',function(req,res){
    
});