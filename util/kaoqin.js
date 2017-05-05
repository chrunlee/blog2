//根据有道日记进行考勤
//https://note.youdao.com/yws/api/personal/file/4D426001FC264342A29BE581D0BBB9DE?cstk=fVsHpNba&dir=false&f=true&isReverse=false&keyfrom=web&len=100&method=listPageByParentId&sort=1

// var url = 'https://note.youdao.com/yws/api/personal/file/4D426001FC264342A29BE581D0BBB9DE?cstk=fVsHpNba&dir=false&f=true&isReverse=false&keyfrom=web&len=40&method=listPageByParentId&sort=1';
var url = 'https://note.youdao.com/yws/api/personal/file/4D426001FC264342A29BE581D0BBB9DE?cstk=ldSV-iDu&dir=false&f=true&isReverse=false&keyfrom=web&len=30&method=listPageByParentId&sort=1';
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var mailer = require('./mailer');
var keyv = {
	1 : '1月,一月',
	2 : '2月,二月',
	3 : '3月,三月',
	4 : '4月,四月',
	5 : '5月,五月',
	6 : '6月,六月',
	7 : '7月,七月',
	8 : '8月,八月',
	9 : '9月,九月',
	10 : '10月,十月',
	11 : '11月,十一月',
	12 : '12月,十二月',
};
var type = ['正常打卡','休息','出差','加班','未记录'];
var map = [];
var getData = function(){
	superagent.get(url).set({
		'Cookie':'OUTFOX_SEARCH_USER_ID=-1053175837@58.56.200.226; P_INFO=chrunlee@163.com|1479091547|0|other|11&16|shd&1478581520&other#shd&370900#10#0#0|151845&0||chrunlee@163.com; Hm_lvt_daa6306fe91b10d0ed6b39c4b0a407cd=1478660637,1478758648,1480311397; JSESSIONID=aaa4iQiUQgARi_McDARIv; Hm_lvt_30b679eb2c90c60ff8679ce4ca562fcc=1480554077; Hm_lpvt_30b679eb2c90c60ff8679ce4ca562fcc=1480554077; OUTFOX_SEARCH_USER_ID_NCOO=158384931.7639371; ___rl__test__cookies=1480554079473; __yadk_uid=jKtm0gbjLaQTDj5ZGlvS0Howiis33Grt; YNOTE_URS_VERIFY=DJyydYzmOmOWk4eK0HOERPB6LJBhLlY0eu0HYfnMUfRlfh4zGP4p406uhf64Rfwy0PLnHqFhHQL0YWk4OAhLk50l5RMPLnMQF0; YNOTE_SESS=v2|sr0mYYzmOmzfnHQZ64lm0QzhLP4O4g4RQ4n4Olh4PS0JZ0fJShHTFRP4hLYf6LwZ0gzhHl564wFRwLRH6Z0fzWRQ4RLJF0H6F0; YNOTE_PERS=v2|urstoken||YNOTE||web||-1||1480554093979||58.56.200.226||chrunlee@foxmail.com||TZhMYY64pS0UGRfTL0LeB0g4P4OYhHJy0lMP4wzO4pB0YY64zG0LkMR6Bk4TB64JuRwLk4wL0LqB0J40MqK0LwyR; YNOTE_LOGIN=3||1480554094000; _gat=1; _ga=GA1.2.1919953558.1478660638; Hm_lvt_4566b2fb63e326de8f2b8ceb1ec367f2=1480554081; Hm_lpvt_4566b2fb63e326de8f2b8ceb1ec367f2=1480554098; YNOTE_CSTK=ldSV-iDu'
	}).end(function(err,res){
		if(err){
			console.log(err);
		}
		var txt = res.text;
		var obj = JSON.parse(txt);
		var data = obj.entries;
		var titleArr = [];
		data.forEach(function(line){
			var meta = line.fileMeta;
			var title = meta.title;
			
			//当前月份统计上一个月的记录
			var month = new Date().getMonth();
			var v = keyv[month];
			var v1 = v.split(',')[0],
				v2 = v.split(',')[1];
			if(title.indexOf(v1) >-1 || title.indexOf(v2) > -1){
				titleArr.push(title);
			}
		});
		getResult(titleArr);
	});
};
var check = function(str,fn){
	superagent.get('http://www.easybots.cn/api/holiday.php?d='+str).end(function(err,res){
		if(err){
			console.log(err);
		}
		var t = res.text;
		var obj = JSON.parse(t);
		var type = obj[str];
		//type == 0 工作日，1 休息，2节假日
		if(fn)fn(type == 0 ? false : true);
	});
};

var checkType = function(i,titleArr,callback){
	var tempDate = new Date();
	var month = tempDate.getMonth() -1;
	tempDate.setMonth(month);
	tempDate.setDate(i);
	var week = tempDate.getDay();
	var year = tempDate.getFullYear();
	var str = ''+(month+1)+'月'+i+'号';
	var flag = false;
	var datestr = year+''+((month+1) < 10 ? '0'+(month+1) : (month+1))+( i<10 ? '0'+i : i);
	var typestr = '';
	titleArr.forEach(function(line){
		typestr = '';
		if(line.indexOf(str) > -1){
			typestr = type[0];
			if(line.indexOf('出差') > -1){
				typestr = type[2];
			}else if(week == 0 || week == 6){
				typestr = type[3]
			}
			flag = true;
		}
	});
	if(typestr == type[2]){//不论是节假日还是休息日，都算出差
		map.push({
			name : str,
			type : typestr
		});
		callback(null,null);
	}else{
		check(datestr,function(isxiuxi){
			if(isxiuxi == true && flag == true){//休息日有工作记录，为加班
				map.push({
					name : str,
					type : type[3]
				});
			}else if(isxiuxi == true && flag == false){//休息日无工作记录，休息
				map.push({
					name : str,
					type : type[1]
				});
			}else if(isxiuxi == false && flag == true){//工作日工作，正常打卡
				map.push({
					name : str,
					type : type[0]
				});
			}else{//工作日无记录，旷工或者拉下了，个人检查
				map.push({
					name : str,
					type : type[4]
				});
			}
			callback(null,null);
		});
	}
};
var getResult = function(titleArr){
	var temp = new Date();
	var month = temp.getMonth()-1;
	temp.setDate(1);
	var last = new Date(temp.getTime() - 1000*60*60*24);
	var nums = last.getDate();
	
	var datearr = [];
	for(var i=1;i<=nums;i++){
		datearr.push(i);
	}
	async.mapLimit(datearr,1,function(i,callback){
		checkType(i,titleArr,callback);
	},function(){
		getText();
	});
};

var getText = function(){//根据map生成一段文本
	var str = '';
	var tempType = '';
	var tempd = '';
	var firstd = '';
	for(var i=0;i<map.length;i++){
		var obj = map[i];
		var d = obj.name;
		var type = obj.type;
		if(tempType == ''){
			tempType = type;
			str += d;
			tempd = d;
			firstd = d;
		}else if(tempType == type){//相同，则累计
			tempd = d;
		}else if(tempType != type){//不同，处理
			if(tempd == firstd){
				str += ' : '+tempType+'<br />';
			}else{
				str+= ' - '+ tempd +' : '+tempType+'<br />';
			}
			//重置
			tempType = type;
			tempd = d;
			firstd = d;
			str += firstd +'' + (i == map.length-1 ? (' : '+type+'<br />') : '');
		}
		
	}
	//发送邮件
	mailer('chrunlee@foxmail.com','月份考勤记录',str,function(){
        console.log('今日统计考勤完成');
    });
};

var allstart= function(){
	var d = new Date();
    var d2 = new Date(d.getTime()+24*60*60*1000);
    var y = d2.getYear();
    var h = d2.getDate();
    var m = d2.getMonth();
    var d3 = new Date(y+1900,m,h);
    var time = d3.getTime() - d.getTime();
    setTimeout(function(){
        //判断今天是不是每个月的第一天，如果是，则执行，否则，调过
        var now = new Date();
        if(now.getDate() == 1){
        	getData();
        }
       // allstart();
    },time);
};
if(process.argv.splice(2).length > 0){
	console.log('gogogo');
	getData();

}
module.exports = allstart;