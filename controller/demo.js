var express = require('express');
var router = express.Router();
var mail = require('../util/mailer');

router.get('/',function(req,res){
    res.render('speedUI/index');
});

/*提供一个邮件发送的快捷入口API*/
router.get('/mail',function(req,res){
	//必须得登录
	var title = req.query.title,content = req.query.content,to = req.query.to;
	var session = req.session;
	console.log(session);
	if(null != session && null != session.email && '' != session.email){
		var from = session.email;
		console.log(from);
		if(null != title && ''!= title && null != to && '' != to){
			mail(to,title+'---来自:'+from,content,function(info){
				console.log(info);
				var str = JSON.stringify(info);
				res.end(str);
			});
		}
	}else{
		res.end('未登录，请登录后尝试')
	}
});
module.exports = router;