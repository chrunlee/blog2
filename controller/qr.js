
var express = require('express');
var qr = require('qr-image');
var appDao = require('../dao/AppDao');
var router = express.Router();

router.get('/',function(req,res,next){
    res.redirect('/qr/index');
});

router.get('/index',function(req,res,next){
    appDao.getById('7',function(data){
        res.render('qr/index',{app : data[0]});
    });
});

var getImg = function(t,s,m,p){
    try{
        s = parseInt(s,10)
        s = s > 20 ? 20 : s;
        s = s < 1 ? 1 : s;
    }catch(e){
        s = 10;
    }
    try{
        m = parseInt(m,10);
        m = m > 4 ? 4 : m;
        m = m < 1 ? 1 : m;
    }catch(e){
        m = 1;
    }
    var img = qr.image(t,{size : s, margin : m,ec_level:'L'});
    return img;
};
router.get('/create',function(req,res,next){
    var t = req.query.t,
        s = req.query.s||'10',
        m = req.query.m||'1',
        p = req.query.p||'png';
    var img = getImg(t,s,m,p);
    res.writeHead(200,{'ContentType':'image/png'});
    img.pipe(res);
});
router.get('/download',function(req,res,next){
    var t = req.query.t,
        s = req.query.s||'10',
        m = req.query.m||'1',
        p = req.query.p||'png';
    var img = getImg(t,s,m,p);
    res.writeHead(200,{'Content-disposition':'attachment; filename=erweima.png','ContentType':'image/png'});
    img.pipe(res);
});
module.exports = router;