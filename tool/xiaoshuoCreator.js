/**
将数据库中所有的小说章节生成文件
***/
var xiaoshuoDao = require('../dao/xiaoshuoDao');
var async = require('async');
var fs = require('fs');
console.log('start save file ');
xiaoshuoDao.getAllZhangjie(function(err,data){
	var d = data[0];
	var size = d.length;
	console.log('记录共：'+size+'条');
	//循环遍历生成
	start(d);
});


var start = function(data){
	async.mapLimit(data,10,function(obj,callback){
		createFile(obj,callback);
	},function(){
		console.log('完!!!!');
	});
};

var createFile = function(obj,callback){
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
			callback(null,null);
		});
	}else{
		fs.mkdirSync(filedir);
		fs.writeFile(filepath,modal,function(){
			console.log('写入章节---'+name);
			callback(null,null);
		});
	}
};
