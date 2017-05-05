//https://douban.fm/j/v2/songlist/470992/?kbps=192
//根据歌单进行查找




var superagent = require('superagent'),
	fs = require('fs'),
	cheerio = require('cheerio');
var radioDao = require('../dao/RadioDao');
var colors = require('colors');
var async  = require('async');
colors.setTheme({
	warn : 'red',
	suc : 'green',
	info : 'yellow'
});


var idArr = [];

var getArt = function(sid,callback){
	var api = 'https://douban.fm/j/v2/artist/'+sid+'/';
	var url = api;
	superagent.get(url).set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Cookie':'flag="ok"; bid=IiKHKoxEe5w; ac="1478423024"; _vwo_uuid_v2=ADD102B842228468034B2722ACED0D98|042739de17ff926d6b1fafb9aece7826; _ga=GA1.2.2015559823.1478423053; _gat=1',
		'Host':'douban.fm',
		'Pragma':'no-cache',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.3'
	}).end(function(err,res){
		if(err){
			console.log('这个有问题：'+sid);
			callback(null,null);
		}else{
			var text = res.text;
			var obj = JSON.parse(text);
			if(obj == null ||obj.songlist== null){
				callback(null,null);
			}else{
				var sl = obj.songlist;
				var datalist = sl.songs;
				saveList(sid,datalist,callback);
			}
		}
	});
};
var getGedan = function(sid,callback){
	var api = 'https://douban.fm/j/v2/songlist/'+sid+'/?kbps=192';
	var url = api;
	superagent.get(url).set({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, sdch',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Cookie':'flag="ok"; bid=IiKHKoxEe5w; ac="1478423024"; _vwo_uuid_v2=ADD102B842228468034B2722ACED0D98|042739de17ff926d6b1fafb9aece7826; _ga=GA1.2.2015559823.1478423053; _gat=1',
		'Host':'douban.fm',
		'Pragma':'no-cache',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.3'
	}).end(function(err,res){
		if(err){
			getArt(sid,callback);
		}else{
			var text = res.text;
			var obj = JSON.parse(text);
			if(obj == null || obj.songs == null || obj.count < 1){
				callback(null,null);
			}else{
				var datalist = obj.songs;
				saveList(sid,datalist,callback);
				
			}
		}
	});
};

var saveList = function(sid,dataList,cbc){
	var newc = 0;
	async.mapLimit(dataList,3,function(one,cb){
		var pic = one.picture||'',
			sid = one.sid,
			url = one.url,
			author = one.artist,
			title = one.title,
			length = one.length,
			ssid = one.ssid,
			public_time = one.public_time,
			ext = one.file_ext,
			kbps = one.kbps,
			sha = one.sha256;
		var saveD = {
			title : title,
			author : author,
			b_pic : pic,
			sid : sid,
			ssid : ssid,
			len : length,
			pubtime : public_time,
			file_ext : ext,
			sha256 : sha,
			b_url : url
		};
		radioDao.checkSha(sha,sid,title,function(flag){
			if(flag == true){
				console.log('title :'+title.warn);
				cb(null,null);
			}else if(flag == false){
				radioDao.save(saveD,function(){
					newc ++ ;
					console.log('title :'+title.suc);
					cb(null,null);
				});
			}
		});
	},function(){
		//保存结束
		console.log(''+sid.suc+' 共'+(dataList.length+'').info+'首歌曲，新保存'+newc+''.suc+'首！');
		cbc();
	});
};

//收集歌单
var collectId = function(){
	//https://douban.fm/j/v2/songlist/explore?type=hot&genre=19&limit=20&sample_cnt=5
	var countarr = [];
	for(var i=0;i<18;i++){
		countarr.push(i);
	}
	async.mapLimit(countarr,3,function(num,cbck){
		var url = 'https://douban.fm/j/v2/songlist/explore?type=hot&genre='+num+'&limit=1000&sample_cnt=5';
		superagent.get(url).set({
			'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding':'gzip, deflate, sdch',
			'Accept-Language':'zh-CN,zh;q=0.8',
			'Cache-Control':'no-cache',
			'Connection':'keep-alive',
			'Cookie':'flag="ok"; bid=IiKHKoxEe5w; ac="1478423024"; _vwo_uuid_v2=ADD102B842228468034B2722ACED0D98|042739de17ff926d6b1fafb9aece7826; _ga=GA1.2.2015559823.1478423053; _gat=1',
			'Host':'douban.fm',
			'Pragma':'no-cache',
			'Upgrade-Insecure-Requests':'1',
			'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.3'
		}).end(function(err,res){
			if(err){
				//集训下个
				cbck(null,null);
			}else{
				var text = res.text;
				var obj = JSON.parse(text);
				if(obj.length > 0){
					obj.forEach(function(ele,index){
						var id = ele.id;
						idArr.push(id);
					});
				}
				cbck(null,null);
			}
		});
	},function(){
		//开始执行
		startCollect();
	});
};

var startCollect = function(){
	async.mapLimit(idArr,3,function(id,cbck){
		getGedan(id,cbck);
	},function(){
		console.log('over');
	});
};

collectId();