//fm
var express = require('express');
var router = express.Router();
var radioDao = require('../dao/RadioDao');

router.get('/',function(req,res){
    res.render('radio/index');
});

router.post('/random',function(req,res){
	radioDao.random(function(err,data){
		var d = data[0];
		var obj = d[0];
		var str = JSON.stringify(obj);
		res.end(str);
	});
});

router.post('/search',function(req,res){
	var v= req.body.v;
	radioDao.search(v,function(err,data){
		var d = data[0];
		var str = JSON.stringify(d);
		res.end(str);
	});
});

router.post('/get',function(req,res){
	var id = req.body.id;
	radioDao.getById(id,function(err,data){
		var d= data[0];
		var o = d[0];
		var str = JSON.stringify(o);
		res.end(str);
	})
});

module.exports = router;