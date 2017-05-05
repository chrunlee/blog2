//路由文件

var luyou = function(app,cfg){
	//===路由开始
	var jsRouter = require('../controller/jsTool');
	var indexRouter = require('../controller/index');//首页动作
	var user = require('../controller/user');//用户登录、注册动作；
	var jsonRouter = require('../controller/jsonTool');//json此操作
	var translateRouter = require('../controller/translate');//翻译
	var chrunlee = require('../controller/chrunlee');//我自己的测试，不开放
	var other = require('../controller/other');//乱起八早，开放
	var comment = require('../controller/comment');//评论
	var article = require('../controller/article');//文章
	var qr = require('../controller/qr');//二维码
	var novel = require('../controller/novel');//小说
	var collect = require('../controller/collect');//收集
	var mp3 = require('../controller/mp3');//mp3
	var lab = require('../controller/lab');
	var speedUI = require('../controller/demo');//尝试自己的风格
	var marry = require('../controller/marry');//纪念
	// var upload = require('./controller/upload');//上传
	var companyConcat = require('../controller/companyConcat');

	app.get('/',function(req,res){
	    res.redirect('/index');
	});
	app.use('/jstool',jsRouter);
	app.use('/jsontool',jsonRouter);
	app.use('/index',indexRouter);
	app.use('/translate',translateRouter);
	app.use('/user',user);
	app.use('/other',other);
	app.use('/comment',comment);
	app.use('/article',article);
	app.use('/qr',qr);
	app.use('/novel',novel);
	app.use('/collect',collect);
	app.use('/fm',mp3);
	app.use('/lab',lab);
	app.use('/demo',speedUI);
	app.use('/marry',marry);
	app.use('/company',companyConcat);
	// app.use('/upload',upload);

	if(!cfg.debug){
	  //开发模式下不执行
	  var dayOfWork = require('../util/workofday');
	  dayOfWork();
	}
};

module.exports = luyou;

