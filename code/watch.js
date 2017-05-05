//监控签到下的code.png文件，并输出code.txt，删除code.png
var fs = require('fs');
var code = require('./getcode');
fs.watchFile('e:/node/签到/code.png',function(){
	code.getCode('e:/node/签到/code.png',function(text){
		console.log('本次验证码：'+text);
		fs.writeFile('e:/node/签到/code.txt',text);
	});
})