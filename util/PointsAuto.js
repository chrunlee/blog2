//自动登录去签到，每日工作
//1.登录华金签到

var superagent = require('superagent');
var cheerio = require('cheerio');
var moment = require('moment');

var huajin = function(){
	var url = 'https://www.huajinzaixian.com/WdzhWdzyManage_signUp.action';//签到
	var url2 = 'https://www.huajinzaixian.com/PointsExchangeManage_toMyPoints.action';//查询积分
	superagent.post(url).set({
		'Accept':'text/plain, */*; q=0.01',
		'Accept-Encoding':'gzip, deflate',
		'Accept-Language':'zh-CN,zh;q=0.8',
		'Cache-Control':'no-cache',
		'Connection':'keep-alive',
		'Content-Length':'0',
		'Cookie':'JSESSIONID=0000vDgoNBhy726oqZ4qdnp1fgZ:-1; userName=chrunlee; loginType=1; Hm_lvt_1ae46cc52cd0979478d7c594ab1fa061=1478844328,1478850970; Hm_lpvt_1ae46cc52cd0979478d7c594ab1fa061=1478851017',
		'Host':'www.huajinzaixian.com',
		'Origin':'https://www.huajinzaixian.com',
		'Pragma':'no-cache',
		'Referer':'https://www.huajinzaixian.com/WdzhWdzyManage_toMyHome.action',
		'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36',
		'X-Requested-With':'XMLHttpRequest'
		
		
	}).end(function(err,res){
		var t = res.text;
		if(t == '2'){
			//
			console.log('已签到过了！');
		}else if(t == '1'){
			console.log('签到成功!')
		}
		superagent.get(url2).set({
			'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding':'gzip, deflate, sdch',
			'Accept-Language':'zh-CN,zh;q=0.8',
			'Cache-Control':'no-cache',
			'Connection':'keep-alive',
			'Cookie':'JSESSIONID=0000vDgoNBhy726oqZ4qdnp1fgZ:-1; userName=chrunlee; loginType=1; Hm_lvt_1ae46cc52cd0979478d7c594ab1fa061=1478844328,1478850970; Hm_lpvt_1ae46cc52cd0979478d7c594ab1fa061=1478851267',
			'Host':'www.huajinzaixian.com',
			'Pragma':'no-cache',
			'Referer':'https://www.huajinzaixian.com/PointsExchangeManage_toMyPoints.action',
			'Upgrade-Insecure-Requests':'1'
		}).end(function(err2,res2){
			var t2 = res2.text;
			var $ = cheerio.load(t2);
			var jifen = $('.survey>span').text();
			console.log(moment(new Date()).format('YYYY-MM-DD')+':'+jifen);
		});;
	});
};


huajin();