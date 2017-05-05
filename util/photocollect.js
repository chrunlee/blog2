//对电脑中的照片进行日期归档，并重命名
// var mulu = 'f:/相册/相册/手机图片';
// var mulu = 'F:/相册/相册/老婆';
var mulu = 'F:/相册/相册/照片';
var target = 'f:/相册/相册/日期归档'
var fs = require('fs');
var path = require('path');
var moment = require('moment');//时间格式化
var async = require('async');
var start = function(url){
	var picArr = getPicArr(url);
	collect(picArr);
};
var getPicArr = function(url){
	var files= fs.readdirSync(url);
	var temparr = [];
	files.forEach(function(name,index){
		var url2 = url+'/'+name;
		//如果是目录，则继续，如果是图片，则放进图片数组中
		var stat = fs.statSync(url2);
		if(stat.isDirectory()){
			var ttmp = getPicArr(url2);
			temparr = temparr.concat(ttmp);
		}else{
			//判断是不是图片
			var ext = path.extname(url2);
			if(ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.jpeg' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF'){
				temparr.push(url2);
			}
		}
	});
	return temparr;
};
var collect = function(data){
	async.mapLimit(data,3,function(url,callback){
		fixOne(url,callback);
	},function(){
		console.log('over');
	});
};

var fixOne = function(picPath,callback){
	//1.找到meta,获取日期，重命名，复制过去
	var data = fs.readFileSync(picPath);
	var d = data.toString();
	var str = d.substring(0,10000);
	var a = /[\d]{4}:[\d]{2}:[\d]{2} [\d]{2}:[\d]{2}:[\d]{2}/.exec(str);
	var dir = '',name = '',ext = path.extname(picPath);
	if(a != null){
		var t = a[0].toString();
		t = t.replace(/:/g,'-').replace(' ','-');
		dir =t.substring(0,10);
		name = t;
	}else{
		var stat = fs.statSync(picPath);
		var ctime = stat.ctime;
		name = moment(ctime).format('YYYY-MM-DD-hh-mm-ss');
		dir = name.substring(0,10);
	}
	name = name + ext;
	var dirpath = target+'/'+dir;
	var filepath = dirpath+'/'+name;
	if(!fs.existsSync(dirpath)){
		fs.mkdirSync(dirpath);
	}
	var input = fs.createReadStream(picPath);
	var output = fs.createWriteStream(filepath);
	input.on('data',function(cc){
		output.write(cc);
	}).on('end',function(){
		console.log('图片:'+picPath+'--复制完毕！');
		callback(null,null);	
	});
};
start(mulu);
