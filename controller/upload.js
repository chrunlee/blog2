//上传
var express = require('express');
var fs = require('fs');
var router = express.Router();
var formidable = require('formidable');
var code = require('../code/getcode');

var isFormdata = function(req){
	var type = req.headers['content-type'] || '';
	return -1 < type.indexOf('multipart/form-data');
};

router.get('/code',function(req,res){
    res.render('upload/uploadcode');
});

router.post('/code',function(req,res){
    //返回
    if(isFormdata(req)){
		var form = formidable.IncomingForm();
		form.uploadDir = 'code';
		form.parse(req,function(err,fileds,files){
			//将文件复制到根目录下的 attachment
			var file = files.file;
			if(file && file.path && fs.existsSync(file.path)){
				fs.rename(file.path,'code/code.png');
			}
			
			//上传成功
			code.getCode(function(text){
				res.setHeader('content-type','text/plain');
				res.end(text);
			});
		});
	}
});

module.exports = router;