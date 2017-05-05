/***
抓取顶点小说网的小说
***/

//先试试一个小说//武破九霄
var bookList = 'http://www.23us.cc/quanben/1';
var bookUrl = 'book.txt';
var fs =require('fs'),
	superagent = require('superagent'),
	cheerio = require('cheerio'),
	async = require('async'),
	http = require('http'),
	iconv = require('iconv-lite');

var xiaoshuoDao = require('../dao/xiaoshuoDao');
var download = require('../util/getBookImg');

Array.prototype.trim = function(){
	var n = this.filter(function(v){
		return v == '' || v == null || v== undefined ? false : true;
	});
	return n;
};

var perfectBookInfo = function(url,id){
	//正则提取bookNo,更新，图片和简介
	url = 'http://'+url;
	var urlTool = require('url');
	var urlOpts = urlTool.parse(url);
	var path = urlOpts.path;
	var host = urlOpts.host;
	var apath = path.split('/');
	apath = apath.trim();
	var no = apath[apath.length-1];
	var infoUrl = host+'/shu/'+no+'/';
	superagent.get(infoUrl).set({
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
		var text = res.text;
		var $ = cheerio.load(text,{decodeEntities:false});
		var img = $('.book-img>img:first-child').attr('src');
		var imgrealpath = host+img;
		var info = $('.book-intro').html();
		var path = require('path');
		var ext = path.extname(imgrealpath);
		var data= {
			id : id,
			no : no,
			img : '/img/'+id+ext,
			description : info
		};
		xiaoshuoDao.updateImg(data,function(err,daaaa){});
		//下载图片
		download(imgrealpath,id);
	});	

};

//下载一本书
var loadBook = function(url,topCallback){
	//1.检查该书是否已经下载过了，检查链接
	var urlTool = require('url');
	var urlObj = urlTool.parse(url);
	var bookOpts = checkBook(url);
	//获取书籍信息并更新
	var id = bookOpts.book.id;
	//superagent 方式
	superagent.get(url).set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Cookie':'__jsluid=1dbb540a8cda7a29387921613cfa6fb8; bdshare_firstime=1476148709433; CNZZDATA1257130134=1834136116-1476144865-%7C1476161065',
		'Host':'www.23us.cc',
		'Pragma':'no-cache',
		'Referer':'http://www.23us.cc/quanben/1',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
	}).end(function(err,res){
		var text = res.text;
		var $ = cheerio.load(text,{decodeEntities:false});
		var chapterList = $('.chapterlist>dd>a');
		//获取章节
		var chapterUrl = [];
		for(var i=0,max=chapterList.length;i<max;i++){
			var temp = chapterList[i];
			if($(temp).attr('href') != undefined && $(temp).attr('href') != ''){
				var tempUrl = $(temp).attr('href');
				chapterUrl.push(url+tempUrl);
			}
		}
		if(!bookOpts.exists){//不存在，插入数据库数据
			var $btitle = $('.btitle'),
				$stat = $('.stats');
			var title = $btitle.find('.fl>h1').html();
			var author = $btitle.find('.fl>em').html();
			author = author.replace('作者：','');
			var isdone = $stat.find('.fr>i:first-child').html();
			var updatetime = $stat.find('.fr>i:last-child').html();
			var data = {
				name : title,
				author : author,
				isdone :isdone,
				updatetime : updatetime,
				id : id
			};
			xiaoshuoDao.update(data,function(){});
			perfectBookInfo(url,id);
			bookOpts.book.start = 0;
			loadChapter(bookOpts.book.id,chapterUrl,0,topCallback);
		}else{//存在，获取已经更新的章节
			xiaoshuoDao.getCountOfId(id,function(err,data){
				var row = data[0];
				var count = row[0].num || 0;
				chapterUrl.splice(0,count);
				console.log('该书已经下载'+count+'章节，还剩下'+chapterUrl.length+'章节');
				loadChapter(bookOpts.book.id,chapterUrl,count,topCallback);
			});
		}
		// console.log(chapterUrl.length+'-----'+chapterUrl[0]);
		
	});
	
};


function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };

var loadChapter = function(bookId,chapterList,counter,topCallback){
	async.mapLimit(chapterList,3,function(chapterUrl,callback){
		if(chapterUrl != ''){
			counter ++ ;
			getChapterContent(chapterUrl,bookId,counter,callback);
		}else{
			callback(null,null);
		}
	},function(){
		console.log('这本书全部下载完毕');
		//更新信息
		topCallback(null,null);
	});
};
//下载内容
var getChapterContent = function(url,bookId,counter,callback){
	console.log(url);
	superagent.get(url).end(function(err,res){
		if(res){
			var text = res.text;
			var $ = cheerio.load(text,{decodeEntities:false});
			var title = $('#BookCon>h1').html();
			var $content = $('#content');
			var html = $content.html();
			var zhangjieId = require('../util/uuid')();
			var data = {
				id : zhangjieId,
				xiaoshuo : bookId,
				name : title,
				sortnum : counter,
				content : html
			};
			xiaoshuoDao.saveZj(data,function(err,result){
				saveFile(zhangjieId);
				sleep(3000);
				callback(null,null);	
				
			});
		}else{
			var zhangjieId = require('../util/uuid')();
			var data = {
				id : zhangjieId,
				xiaoshuo : bookId,
				name : '',
				sortnum : counter,
				content : ''
			};
			xiaoshuoDao.saveZj(data,function(err,result){
				saveFile(zhangjieId);
				sleep(3000);
				callback(null,null);	
				
			});

		}
	});
};



//检查链接是否存在
var bookArray = [];
var checkBook = function(url){
	var r = false,id = '';
	bookArray.forEach(function(ele,index){
		var eleArr = ele.split(',');
		var tempUrl = eleArr[0];
		var tempId = eleArr[1];
		if(url == tempUrl){
			r = true;
			id = tempId;
		}
	});
	if(!r){//如果不存在，则将地址写入文件，同时添加到内存中
		bookArray.push(url);
		//向数据库添加一条记录，然后获得ID进行保存，以及已经更新到第几章节
		id= require('../util/uuid')();
		xiaoshuoDao.create(id,function(err,result){});
		fs.appendFile(bookUrl,url+','+id+'\r\n');
	}
	return {
		exists : r,
		book : {
			id : id
		}
	};
};


var start = function(){
	//此处应该从全部，读取所有书的链接，然后一个一个遍历；
	var urlTool = require('url');
	var urlObj = urlTool.parse(bookList);
	var host = urlObj.host;
	superagent.get(bookList).set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Cookie':'__jsluid=1dbb540a8cda7a29387921613cfa6fb8; bdshare_firstime=1476148709433; CNZZDATA1257130134=1834136116-1476144865-%7C1476182665',
		'Host':'www.23us.cc',
		'Pragma':'no-cache',
		'Referer':'http://www.23us.cc/',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
	}).end(function(err,res){
		var text = res.text;
		fs.writeFile('all.html',text);
		var $ = cheerio.load(text,{decodeEntities:false});
		var bookUrlList = [];
		console.log($('[id^=tabData_]').length);
		$('[id^=tabData_]').each(function(index,ele){
			var divObj = $(ele).find('.topbooks')[0];
			var aArray = $(divObj).find('a');
			aArray.each(function(aIndex,aObj){
				var href = $(aObj).attr('href');
				bookUrlList.push(host+href);
			});
		});
		startEachBook(bookUrlList);
	});
	
};

var startEachBook = function(bookUrlList){
	console.log('全本书籍共：'+bookUrlList.length+'本');
	async.mapLimit(bookUrlList,1,function(tempUrl,callback){
		console.log(tempUrl);
		loadBook(tempUrl,callback);	
	},function(){
		console.log('all over,该网站全本书籍已下载完毕');
	});
};


//加载文本内容到内存
var gogoing = function(){
	if(fs.existsSync(bookUrl)){
		var stat = fs.statSync(bookUrl);
		var readline = require('readline');
		var rl = readline.createInterface({input:fs.createReadStream(bookUrl)});
		rl.on('line',function(line){
			if(null != line && line != ''){
				bookArray.push(line.toString());
			}
		}).on('close',function(){
			//开始执行
			start();
		});
	}else{
		//如果不存在，则创建
		fs.writeFile(bookUrl,'');
		start();
	}
};

var saveFile = function(zhangjieId){
	xiaoshuoDao.saveFile(zhangjieId,function(err,data){
		var d = data[0];
		var dd = d[0];
		createFile(dd);
	});
};

var createFile = function(obj){
	var no = obj.sortnum,bookno = obj.bookno,content = obj.content,name = obj.name,xiaoshuoId = obj.xiaoshuo;
	var tempHtml = '';
	if(no == 1){
		//没有上一章节
		tempHtml = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><span class="btn btn-default"><a href="/novel/list/'+xiaoshuoId+'">目录</a></span><span class="btn btn-default"><a href="/novel/'+bookno+'/'+(no+1)+'.html">下一章</a></span></div>';
	}else{
		tempHtml = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><span class="btn btn-default"><a href="/novel/'+bookno+'/'+(no-1)+'.html'+'">上一章</a></span><span class="btn btn-default"><a href="/novel/list/'+xiaoshuoId+'">目录</a></span><span class="btn btn-default"><a href="/novel/'+bookno+'/'+(no+1)+'.html">下一章</a></span></div>';
	}
	var modal = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'+name+'  - 程序员的百宝箱</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="keywords" content="'+name+'目录,程序员的百宝箱,chrunlee,www.chrunleexun.com,在线工具百宝箱,在线工具程序员,程序员在线工具,工具箱,李迅,lixun"><meta name="description" content="{{novel.name}}目录,程序员的百宝箱,chrunlee,www.chrunleexun.com,在线工具百宝箱,在线工具程序员,程序员在线工具,工具箱,李迅,lixun"><link media="all" type="text/css" rel="stylesheet" href="/plugins/bootstrap/dist/css/bootstrap.min.css"><link media="all" type="text/css" rel="stylesheet" href="/plugins/font-awesome/css/font-awesome.min.css"><link media="all" type="text/css" rel="stylesheet" href="/css/base.css"><link media="all" type="text/css" rel="stylesheet" href="/plugins/layer/skin/layer.css"><link rel="shortcut icon" href="/favicon.ico"/><script type="text/javascript" src="/js/jquery.js"></script><script type="text/javascript" src="/plugins/bootstrap/dist/js/bootstrap.min.js"></script><script type="text/javascript" src="/plugins/layer/layer.js"></script><!--[if lt IE 9]><script src="plugins/html5shiv/dist/html5shiv.min.js"></script><![endif]--><link media="all" type="text/css" rel="stylesheet" href="/css/novel.css"  /></head><body><header class="header navbar navbar-fixed-xs navbar-default" role="navigation"><div class="container-fluid"><ul class="nav navbar-nav navbar-right hidden-xs"><li><a href="javascript:;" id="headerLoginInfo" class="hovermenu">登录</a><ul class="dropdown-menu"><li role="presentation" ><a role="menuitem" tabindex="-1" href="/user/center">个人中心</a><a role="menuitem" tabindex="-1" href="/user/logout">退出</a></li></ul></li><li id="registerButton"><a href="/user/register">注册</a></li></ul><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#header-menu"><span class="sr-only">切换导航</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a href="/" class="navbar-brand"><img src="/css/img/logo-en.png" alt="" title="程序员的百宝箱，工具箱，致力于程序开发的身边工具"></a></div><div class="collapse navbar-collapse" id="header-menu"><ul class="nav navbar-nav headermenu" id="headermenu"><li url="/article,/article/list,/article/saveArticle,/article/view/" class="active"><a href="/article/list">笔记</a></li><li url="/novel,/novel/list,/novel/view/" class=""><a href="/novel">小说</a></li></ul></div></div></header><script type="text/javascript" src="/js/loadInfo.js"></script><div class="container"><div class="row">'+tempHtml+'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"></div><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 novelwrap"><div class="caption">'+name+'</div><div class="novelcontent">'+content+'</div><p class="help-block">如有侵权，请发信告之，会尽快删除。</p></div>'+tempHtml+'</div></div><footer><div class="text-center padder-v m-t clearfix"><p><small>Copyright © 2016 . Powered by chrunlee.<img src="/css/img/logo.png" style="width:16px;height:16px;margin-left:10px;margin-top:-5px;" /></small></p><p><small>如果您有什么建议或者需求，可发信给我,我会考虑并加上的<email>chrunlee@foxmail.com</email></small></p></div></footer><script>var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "//hm.baidu.com/hm.js?48498d772e388515246617b7630e2944";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s);})();</script></body></html>';
	var filedir = __dirname+'/../public/novel/'+bookno+'/';
	var filepath = filedir+no+'.html';
	if(fs.existsSync(filedir)){
		fs.writeFile(filepath,modal,function(){
			console.log('写入章节---'+name);
		});
	}else{
		fs.mkdirSync(filedir);
		fs.writeFile(filepath,modal,function(){
			console.log('写入章节---'+name);
		});
	}
};

gogoing();