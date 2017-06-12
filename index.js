var express = require('express');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');
var session = require('express-session');
var app  =  express();
var cfg = require('./config/cfg');

//==web服务器设置开始
swig.setDefaults({ autoescape: false });
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'html');
app.engine('html',swig.renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret : 'lixun'
}));
//===web服务器设置结束

//==路由
var luyou = require('./config/router');
luyou(app,cfg);
//===路由结束
//app.use('/chrunlee.html',chrunlee);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // require('./util/dayOfHistory')(function(data){
     res.render('error/404', {
      message: err.message,
      data : '',
      error: {},
      title : '页面走丢了...',
      content : '<a href="/">返回首页</a>'
    });
  // });
});

app.listen(5200,function(){
    console.log('port : 5200');
});