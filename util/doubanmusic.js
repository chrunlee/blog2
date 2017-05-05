//静悄悄的下载豆瓣的mp3

// var api = 'https://douban.fm/j/v2/playlist?channel=0&kbps=192&client=s%3Amainsite%7Cy%3A3.0&app_name=radio_website&version=100&type=s&sid=1422416&pt=&pb=128&apikey=';

https://douban.fm/j/v2/playlist?channel=0&kbps=128&client=s%3Amainsite%7Cy%3A3.0&app_name=radio_website&version=100&type=s&sid=2181929&pt=&pb=128&apikey=
var ssid ='678275';
var c = 2000;

var temp = ssid;

var superagent = require('superagent'),
	fs = require('fs'),
	cheerio = require('cheerio');
var radioDao = require('../dao/RadioDao');
var colors = require('colors');
colors.setTheme({
	warn : 'red',
	suc : 'green',
	info : 'yellow'
});
var r = 0,h = 0;
var getOne = function(callback){
	var api = 'https://douban.fm/j/v2/playlist?channel='+c+'&app_name=radio_website&version=100&type=s&sid='+ssid;
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
			console.log(err);
			callback(null,null);
		}else{
			var text = res.text;
			var obj = JSON.parse(text);
			if(obj == null || obj.song == null || obj.song[0] == null){
				callback(null,null);
			}else{
				var song = obj.song;
				var one = song[0];
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
				ssid = sid;
				radioDao.checkSha(sha,sid,title,function(flag){
					if(flag == true){
						h ++;
						console.log('title :'+title.warn);
						callback(null,null);
					}else if(flag == false){
						radioDao.save(saveD,function(){
							r ++ ;
							console.log('title :'+title.suc);
							callback(null,null);
						});
					}
				});
			}
		}
	});
};
var rrr = 0;
var count = function(){
	setTimeout(function(){
		radioDao.count([],function(err,data){
			var d = data[0];
			var num = d[0].num;
			if(h+r == 0){
				c++;
				console.log('该频道没歌曲！'+((c-1)+'').warn+'--->'+(c+'').info);
			}else{
				var repeat = Math.floor(h/(h+r)*100);
				console.log('共收集---'+(num+'').info+'---音乐！此阶段内('+c+')：下载新歌曲'+(r+'').suc+'首，发现重复歌曲：'+(h+'').warn+'首，重复率：'+(repeat+'').info+'%');
				
				//当发现超过90%的时候，停止API，更换ssid
				if(r == 0){
					c++;
					rrr = 0;
					console.log('重复率太高,更换频道！'+((c-1)+'').warn+'--->'+(c+'').info);
				}else if(r < 3){
					console.log('重复率太高，更换sid!___'+(ssid.warn)+'-->'+(temp.suc));
					// ssid = temp;
					rrr ++ ;
				}
				h = 0;
				r = 0;
			}
			if(rrr > 2){
				rrr = 0;
				c++;
				console.log('重复率太高,更换频道！'+((c-1)+'').warn+'--->'+(c+'').info);
			}
			count();
		});
	},10000);
};
var start = function(){
	setTimeout(function(){
		getOne(function(){
			start();
		});
	},100);

};

//根据art进行查找



start();
count();