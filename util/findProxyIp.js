//查找可用代理IP 
//每隔五分钟获取一次，获取到结果后，对IP进行验证，如果通过，则保存，如果不通过，则不保存？或者直接保存，然后
var iconv = require('iconv-lite');
var colors = require('colors');
var async = require('async');
colors.setTheme({
	red : 'red',
	green : 'green',
	yellow : 'yellow'
});
var ProxyIp = function(){
	this.time = 2 * 1000 * 60;//下次请求的API时间
	this.super = require('superagent');
	this.ipApi = 'http://api.xicidaili.com/free2016.txt';
	this.dao = require('../dao/IpDao');	
	this.http = require('http');
	this.checkIpNums = 50;
	this.checkIpNumOnce = 3;
	this.list = [];
};

ProxyIp.prototype.next = function(){
	var thiz = this;
	thiz.super.get(this.ipApi).end(function(err,res){
		var text = res.text;
		var list = text.split('\r\n');
		var data = [];
		list.forEach(function(ele,index){
			data.push({
				ip : ele.split(':')[0],
				port : ele.split(':')[1]
			});
		});
		thiz.saveList(data);
	});
};
ProxyIp.prototype.saveList = function(data){
	var thiz = this;
	async.mapLimit(data,3,function(obj,callback){
		thiz.save(obj,callback);
	},function(){
		thiz.msg('本次IP地址保存完毕');
	});
};
ProxyIp.prototype.msg = function(msg,flag){
	//flag : 1 成功，2失败，3信息
	console.log(msg);
};
ProxyIp.prototype.save = function(obj,callback){
	this.dao.save(obj,function(err,data){
		callback(null,null);
	});
};
//检查IP是否可用
ProxyIp.prototype.checkAble = function(){
	var thiz = this;
	thiz.dao.getIp(thiz.checkIpNums,function(err,data){
		if(err){
			console.log(err);
			thiz.checkAble();
		}else{
			var fdata = data[0];
			var ff = [];
			for(var i=0;i<fdata.length;i++){
				var temp = fdata[i];
				ff.push({
					id : temp.id,
					ip : temp.ip,
					port : temp.port
				});
			}
			if(ff.length > 0){
				thiz.gogogo(ff);	
			}else{
				//数据库已经没有可验证的代码了。。将所有的更新为0,重新验证
				thiz.reset(function(){
					thiz.checkAble();
				});
			}
			
		}
	});
};
ProxyIp.prototype.reset = function(fn){
	this.dao.reset(function(){
		if(fn)fn();
	});
};
ProxyIp.prototype.gogogo = function(data){
	var thiz = this;
	async.mapLimit(data,thiz.checkIpNumOnce,function(ipObj,callback){
		thiz.checkIp(ipObj,callback);
	},function(){
		console.log('一轮检测完毕，继续下一轮'.yellow);
		//集体处理更新
		var tempList = thiz.list;
		thiz.list = [];
		async.mapLimit(tempList,5,function(td,cb){
			if(td.flag == true){
				thiz.update(td.id,2,cb);
			}else{
				thiz.delete(td.id,cb);
			}
		},function(){
			console.log('更新完毕');
			thiz.checkAble();
		});
	});
};
ProxyIp.prototype.update = function(id,flag,done){
	var thiz = this;
	thiz.dao.update(id,flag,function(){
		done(null,null);
	});
};
ProxyIp.prototype.delete = function(id,done){
	var thiz = this;
	thiz.dao.delete(id,function(){
		done(null,null);
	});
};
ProxyIp.prototype.pingIp = function(id,ip,port,fn){
	var exec = require('child_process').exec;
	var cmd = 'ping '+ip;
	exec(cmd,function(err,stdout,stderr){
		if(err){
			console.log(err);
		}else{
			console.log(stdout);
		}
	});
};
ProxyIp.prototype.checkIp = function(ipObj,callback){
	var thiz = this;
	var http = thiz.http;
	var id = ipObj.id,ip = ipObj.ip,port = ipObj.port;
	var opt = {
		host : ip,
		port : port,
		method : 'GET',
		path : 'http://pv.sohu.com/cityjson',
		headers:{
			'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding':'gzip, deflate, sdch',
			'Accept-Language':'zh-CN,zh;q=0.8',
			'Cache-Control':'no-cache',
			'Connection':'keep-alive',
			'Pragma':'no-cache',
			'Upgrade-Insecure-Requests':'1',
			'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2729.4 Safari/537.36'
		}
	};
	var hasCB = false;
	var request_timer = setTimeout(function() {
	    req.abort();
	}, 5000);
	var req = http.request(opt,function(res){
		var chunks = [];
		res.on('data',function(chunk){
			chunks.push(chunk);
		});
		res.on('end',function(){
			clearTimeout(request_timer);
			var txt = iconv.decode(Buffer.concat(chunks), 'gb2312');
			if(txt.indexOf(ip) > -1){
				var a = txt.match(/"cname": "(.*)"\}/);
				if(a && a[1]){
					var loc = a[1];
					thiz.msg('该IP '+ip.green+" 属于 "+loc.yellow);	
				}
				thiz.list.push({id:id,flag:true});
				if(hasCB == false){
					hasCB = true;
					callback(null,null);
				}
			}else{
				console.log('该IP'+ip.red+'无效！');
				thiz.list.push({id:id,flag:false});
				if(hasCB == false){
					hasCB = true;
					callback(null,null);	
				}
				
			}
		});
	}).on('error',function(e){
		clearTimeout(request_timer);
		thiz.msg('该IP'+ip+'无效！');
		thiz.list.push({id:id,flag:false});
		if(hasCB == false){
			hasCB = true;
			callback(null,null);
		}
		
	});
	req.end();
};

ProxyIp.prototype.startCheck = function(){
	var thiz = this;
	thiz.checkAble();
};
ProxyIp.prototype.startNext = function(){
	var thiz = this;
	setInterval(function(){
		thiz.next();
	},thiz.time);
	thiz.next();
};
ProxyIp.prototype.start = function(){
	var thiz = this;
	thiz.startNext();
	thiz.startCheck();
	// thiz.checkIp2(1,'197.97.146.62','8080',function(){});
};
(function(){
	console.log('start');
	var a = new ProxyIp()
	a.start();
})();
