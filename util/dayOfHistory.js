/***
 历史上的今天
 ***/
 var superagent = require('superagent');
 var getData = function(fn){
    superagent.get('http://www.ipip5.com/today/api.php?type=json')
     .set({
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'gzip, deflate, sdch',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Cookie':'yunsuo_session_verify=38dd27c4581d46c3e70dde23922e4423',
        'Host':'www.ipip5.com',
        'Pragma':'no-cache',
        'Upgrade-Insecure-Requests':'1',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
     })
     .end(function(err,res){
        if(res){
            var text = res.text;
            var data = JSON.parse(text);
            fn(data);
        }else{
            fn('');
        }
        
     });
 };
 module.exports = getData;

 