var express = require('express');
var router = express.Router();
var articleDao = require('../dao/ArticleDao');
var superagent = require('superagent');
var cheerio = require('cheerio');
var getNotePic = require('../util/getNotePic');
var getMdFile = require('../util/getMdFile');

router.get('/',function(req,res){
    res.redirect('/article/list');
});

router.get('/saveArticle',function(req,res){
    res.render('article/articleSave');
});

router.get('/add',function(req,res){
    res.render('article/articleAdd');
});
router.post('/saveArticle',function(req,res){
    var msg = '';
    var shareid = req.body.shareid,
        type = req.body.type;
    if(null != shareid && '' != shareid && null != type){
        //1. 去有道爬取信息
        var youdao = 'http://note.youdao.com/yws/public/note/'+shareid;
        superagent.get(youdao).end(function(err,youdaores){
            var text = youdaores.text;
            var resobj = JSON.parse(text);
            if(resobj.error){
                res.end(resobj.message);
            }else{
                //处理内容，如果内容有中iamge 
                if(resobj.content){
                    var $ = cheerio.load(resobj.content);
                    if($('img').length > 0){
                        $('img').each(function(index,ele){
                            var src = $(ele).attr('src');
                            //同时替换
                            var id = src.substring(src.lastIndexOf('/')+1);
                            $(ele).attr('src','/img/'+id+'.png');
                            getNotePic(src,id);
                        });
                    }
                    resobj.content = $.html();
                }else{
                    //认定为md文件，将文件下载下来，并将路径保存
                    getMdFile(resobj.p,shareid);
                    resobj.content = '/md/'+shareid+'.md';
                    resobj.tl = resobj.tl.substring(0,resobj.tl.indexOf('.md'));
                }
                
                articleDao.getById(shareid,function(err,rrr){
                    if(rrr[0].length > 0){
                        articleDao.updateArticle(shareid,resobj.content,function(){
                            res.end('文章《'+ resobj.tl +'》更新成功');
                        });
                    }else{
                        var data = {
                            createtime : new Date(),
                            title : resobj.tl,
                            content : resobj.content,
                            author : 'chrunlee',
                            id : shareid,
                            type : type
                        };
                        articleDao.saveArticle(data,function(){
                            res.end('文章《'+ resobj.tl +'》保存成功');
                        });
                    }
                });
            }
        });
    }else{
        msg = '提交数据不正确！';
        res.end(msg)
    }
});

router.get('/view/:id',function(req,res){
    var id = req.params.id;
    id = id.split('.')[0];
    articleDao.updateReadNum(id);
    articleDao.getView(id,function(err,data){
        var article = data[0][0],
            readlist = data[1],
            typelist = data[2],
            datelist = data[3];
        var reg=new RegExp("^/md/");    
        if(reg.test(article.content)){
            res.render('article/view2',{article : article,readlist : readlist ,typelist : typelist,datelist : datelist});
        }else{
            res.render('article/view',{article : article,readlist : readlist ,typelist : typelist,datelist : datelist});    
        }
    });
});

router.get('/list',function(req,res){
    var p = req.query.p || 1;//分页参数
    var start = (p-1)*10;
    var t=req.query.t;  //分类参数
    var d = req.query.d;//日期参数
    var q = req.query.q;//检索参数
    //以上只有有一个

    if(t == null && d == null && q == null){
        //全部
        articleDao.getList(start,10,function(err,arr){
            var list = arr[0],
                readlist = arr[1],
                total = arr[2][0].num,
                typeList = arr[3],
                datelist = arr[4];
            res.render('article/list',
            {
                list : list,
                total:total,
                readlist : readlist,
                typelist : typeList,
                datelist : datelist,
                msg : '所有文章'
            });        
        });
    }else if(null != t){
        //类型分类
        articleDao.getTypeList(start,10,t,function(err,arr){
            var list = arr[0],
                readlist = arr[1],
                total = arr[2][0].num,
                typeList = arr[3],
                datelist = arr[4];
            res.render('article/list',
            {
                list : list,
                total:total,
                readlist : readlist,
                typelist : typeList,
                datelist : datelist,
                msg : '分类 : '+t+'下的文章'
            });        
        });
    }else if(null != d){
        //归档分类
        articleDao.getDateList(start,10,d,function(err,arr){
            var list = arr[0],
                readlist = arr[1],
                total = arr[2][0].num,
                typeList = arr[3],
                datelist = arr[4];
            res.render('article/list',
            {
                list : list,
                total:total,
                readlist : readlist,
                typelist : typeList,
                datelist : datelist,
                msg : '归档 : '+d+'下的文章'
            });        
        });
    }else if(null != q){
        //检索关键字
        articleDao.getQueryList(start,10,q,function(err,arr){
            var list = arr[0],
                readlist = arr[1],
                total = arr[2][0].num || 0,
                typeList = arr[3],
                datelist = arr[4];
            res.render('article/list',
            {
                list : list,
                total:total,
                readlist : readlist,
                typelist : typeList,
                datelist : datelist,
                msg : '检索关键字 : '+q+'下的文章'
            });        
        });

    }
    
});

module.exports = router;