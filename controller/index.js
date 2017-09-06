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


router.get('/huangjin',function(req,res){

    //1.爬取网站美元汇率
    //2.进行计算
    //3.展示结果

    var url = 'http://hq.sinajs.cn/rn=1499736015005list=fx_susdcny';
    var superagent = require('superagent');
    superagent.get(url).set({
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'gzip, deflate, sdch',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Host':'hq.sinajs.cn',
        'Pragma':'no-cache',
        'Upgrade-Insecure-Requests':'1',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }).end(function(err,restxt){
        if(err)console.log(err);
        var txt = restxt.text;
        console.log(txt);
        res.render('other/huangjin',{
            meiyuan : '1'
        });
    });
});

module.exports = router;