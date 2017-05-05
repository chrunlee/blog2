//检查域名是否注册


var request = require('request');
var async = require('async');
var colors = require('colors');
var fs = require('fs');
var wordsDao = require('../dao/WordDao');
colors.setTheme({
	red : 'red',
	green : 'green'
});

var check = function(domain,callback){
	var url = 'https://apidomains.qcloud.com/model/check_domains?g_tk=254270477&t=1352121016&_format=json&domain='+domain+'&tlds=.com';	
	request({
		url : url
	},function(req,res,body){
		// console.log(body);
		var obj =JSON.parse(body);
		var hasreg = true;
		try{
			hasreg = obj.result[0].reged;
		}catch(e){}
		if(hasreg == false){
			console.log(domain+'.com '+'未注册'.green);
			//写入文本
			fs.appendFile('e:/domain.txt',domain+'.com \r\n');
		}else{
			console.log(domain+'.com '+'已注册'.red);
		}
		callback(null,null);
	});	
};

var dom = process.argv.splice(2);
dom.forEach(function(ele,index){
	check(ele,function(){});
});
// var data = [];
// //1.检索三位数字
// var getRandom = function(num){
// 	var r = '';
// 	var zz = '1234567890'.split('');
// 	for(var i=0;i<num;i++){
// 		r += zz[Math.floor(Math.random()*zz.length)];
// 	}
// 	return r;
// };
// //随机三位数
// for(var i=0;i<10000;i++){
// 	var s = getRandom(5);
// 	data.push(s);
// }
// var startCheck = function(){
// 	async.mapLimit(data,20,function(domain,callback){
// 		check(domain,callback);
// 	},function(){
// 		console.log('over');
// 	});	
// };

// var getexplain = function(){
// 	fs.readFile('e:/domain.txt',function(err,data){
// 		data = data.toString();
// 		var d = data.split('\r\n');
// 		lala(d);
// 	});
// };
// var str = '';
// var lala = function(data){
	
// 	async.mapLimit(data,3,function(domain,callback){
// 		getOne(domain,callback);
// 	},function(){
// 		fs.writeFile('e:/domain2.txt',str);
// 	});
// };

// var getOne = function(domain,callback){
// 	domain = domain.replace('.com','');
// 	//根据domain查意思，并拼接
// 	wordsDao.getExplain(domain,function(err,data){
// 		var d = data[0];
// 		var txt = '';
// 		if(d[0] && d[0].txt){
// 			txt = d[0].txt;
// 		}
// 		str += domain+'.com -- '+txt+'\r\n';
// 		callback(null,null);
// 	});
// };

// startCheck();
// getexplain();