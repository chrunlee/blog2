//获得验证码
var exec = require('child_process').exec;
var getCode = function(png,fn){
	var root = __dirname;
	exec('python '+root+'/getcode.py '+png+'',function(err,stdout,stderr){
		var text = stdout;
		if(fn)fn(text);
	});
};
module.exports = {
	getCode : getCode
};