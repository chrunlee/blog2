//获得公司的联系人信息

var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var companyDao = require('../dao/CompanyConcatDao');
var chalk = require('chalk');
var async = require('async');
var join = require('path').join;
var url = 'http://xt.dhcc.com.cn/t00201.do';



var getFiles = function(){
	var dir = 'e:/company/';
	fs.readdir(dir,function(err,list){
		var data = [];
		list.forEach(function(path,index){
			if(path.indexOf('.html')>-1){
				data.push(join(dir,path));
			}
		});
		listFile(data);
	})
};
var users = [];
var listFile = function(list){
	async.mapLimit(list,1,function(path,callback){
		getData(path,callback);
	},function(){
		console.log('数据读取完毕,开始写入');
		saveData(users);
	});
};

var getData = function(path,callback){
	var body = fs.readFileSync(path);
	var html = iconv.decode(body,'gb2312');
	var $ = cheerio.load(html);
	var data = $('#valueTr');
	var datalist = [];
	// data.each(function(){
	// 	$(this).childrens[0]
	// });
	for(var i=0,max=data.length;i<max;i++){
		var obj = data[i];
		var danweimingcheng = $(obj.children[1]).text();
		var bumenmingcheng = $(obj.children[3]).text();
		var bianhao = $(obj.children[5]).text();
		var xingming =$(obj.children[7]).text();
		var zuoji = $(obj.children[9]).text();
		var shouji = $(obj.children[11]).text();
		var shouji2 = $(obj.children[13]).text();
		var youxiang = $(obj.children[15]).text();
		var youxiang2 = $(obj.children[17]).text();
		var gengxin = $(obj.children[19]).text();
		var beizhu = $(obj.children[21]).text();
		var rs = {
			dname : danweimingcheng,
			bname : bumenmingcheng,
			bh : bianhao,
			name : xingming,
			phone : zuoji,
			mobile : shouji,
			mobile2 : shouji2,
			email : youxiang,
			email2 : youxiang2,
			update : gengxin,
			remark : beizhu
		};
		users.push(rs);
	}
	callback(null,null);
};



var saveData = function(list){
	async.mapLimit(list,1,function(obj,callback){
		saveRecord(obj,callback);
	},function(){
		console.log(chalk.green('全部保存完毕!共计记录数应为：'+list.length));
		//等待3分钟后再执行
		var randomTime= 1000 * 60 * 3;
		var rd =Math.random()*randomTime+ (1000 * 20);
		setTimeout(function(){
			getData();
		},rd);
	});
};

var saveRecord = function(obj,callback){
	companyDao.save(obj,function(err,data){	
		console.log(chalk.red(obj.name)+' 信息保存成功!');
		callback(null,null);
	});
};

getFiles();
// getData('e:\\company\\79.html',function(){})