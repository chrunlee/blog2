//从有道上下载MDfile到本地
var superagent = require('superagent');
var urlTool = require('url');
var fs = require('fs');
var path = require('path');
var download = function(pid,id){
    var url = 'http://note.youdao.com/yws/api/personal/file'+pid+'?method=download&read=true&shareKey='+id+'&cstk=false'
    try{
    if(!url.indexOf('http:') < 0){
        url = 'http://'+url;
    }
    var urlOpts = urlTool.parse(url);
    var ext ='.md';
    var host = urlOpts.host;
    superagent.get(url).set({
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'gzip, deflate, sdch',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Cache-Control':'no-cache',
        'Connection':'keep-alive',
        'Cookie':'JSESSIONID=aaaFCSj9fIb5I7cCYtRDv; _ga=GA1.2.294303027.1475135597; _gat=1',
        'Host':host,
        'Pragma':'no-cache',
        'Upgrade-Insecure-Requests':'1',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
    }).end(function(err,res){
        if(err){
            console.log(err);
        }else{
            fs.writeFile(__dirname+'/../public/md/'+id+ext,res.text);
        }
    });
}catch(e){
    console.log(e);
}
};

module.exports = download;