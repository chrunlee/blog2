//从有道上下载图片到本地
var superagent = require('superagent');
var urlTool = require('url');
var fs = require('fs');
var path = require('path');
var download = function(url,id){
    console.log(url);
    try{
    if(!url.indexOf('http:') < 0){
        url = 'http://'+url;
    }
    var urlOpts = urlTool.parse(url);
    var ext = path.extname(url);
    var host = urlOpts.host;
    superagent.get(url).set({
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Cookie':'__jsluid=1dbb540a8cda7a29387921613cfa6fb8; bdshare_firstime=1476148709433; 37cs_user=37cs76960705421; bookid=18202; chapterid=3529914; chaptername=%25u7B2C%25u4E00%25u7AE0%2520%25u7A7F%25u8D8A%25u540E%25u7684%25u4E16%25u754C%2521; 37cs_show=230; CNZZDATA1257130134=1834136116-1476144865-%7C1476323069',
		'Host':'www.23us.cc',
		'Pragma':'no-cache',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
    }).end(function(err,res){
        if(err){
            console.log(err);
        }else{
            fs.writeFile(__dirname+'/../public/img/'+id+ext,res.body);
        }
    });
}catch(e){
    console.log(e);
}
};

module.exports = download;


