//
var fs = require('fs');
var url = 'f:/相册/相册/t.jpg';

fs.readFile(url,function(err,data){
	var d = data.toString();
	var str = d.substring(0,10000);
	var a = /[\d]{4}:[\d]{2}:[\d]{2} [\d]{2}:[\d]{2}:[\d]{2}/.exec(str);
	var t = a[0].toString();
	t = t.replace(/:/g,'-').replace(' ','-');
	console.log(t);
});
