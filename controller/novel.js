//小说控制器
var express = require('express');

var router = express.Router();

var xiaoshuoDao = require('../dao/xiaoshuoDao');

router.get('/',function(req,res,next){
	xiaoshuoDao.getList(function(err,data){
		var list = data[0];
		res.render('novel/index',{
			list : list
		});
	});
});

router.get('/list/:id',function(req,res,next){
	var id = req.params.id;
	xiaoshuoDao.getChapterList(id,function(err,data){
		// console.log(data);
		var novel = data[0][0];
		var list = data[1];
		res.render('novel/list',{
			list : list,
			novel :novel
		});
	});

});
router.get('/view/:id',function(req,res,next){
	var id = req.params.id;
	res.redirect('/novel/'+id+'.html');
});

module.exports = router;