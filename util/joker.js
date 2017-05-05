//采集百思不得姐的段子

//1.每两个小时采集一次
//2.采集根据时间判断
//3.采集的数据存入数据库
//4.每天推送几个新的到邮箱

var superagent = require('superagent'),
	cheerio = require('cheerio'),
    mailer = require('./mailer');

var time = new Date();

var getJoker = function(){
	var url = 'http://www.budejie.com/new-text/';
	superagent.get(url).end(function(err,res){
		var text = res.text;
		var $ = cheerio.load(text,{decodeEntities:false});
		var $list = $('.j-r-list>ul>li');
		console.log($list.length);
		var data = [];
		$list.each(function(){
			var $li = $(this);
			var time = $li.find('.u-time').text();
			var text = $li.find('.j-r-list-c-desc').html();
			data.push(text);
		});
		mailer('chrunlee@foxmail.com','段子',data.join('<br /><hr />'),function(){
            console.log('今日段子收集完毕');
        });
	});
};

getJoker();