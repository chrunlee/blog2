//用于查找公司人员的姓名，不提供全部查询，只提供关键词检索（单字是否提供）
var express = require('express');
var router = express.Router();
var companyDao = require('../dao/CompanyConcatDao');

router.get('/search',function(req,res){
    var q = req.query.k;
    var result = {};
    if(q == undefined){
        console.log(q);
        result.success = false;
        result.msg = '请输入检索条件进行查询!';
        var str = JSON.stringify(result);
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.end(str);
    }else{
        q = q.replace(/\s/g,'');
        if(q == '' || q.length == 1){
            result.success = false;
            result.msg = '请输入检索条件进行查询!';
            var str = JSON.stringify(result);
            res.setHeader('content-type', 'text/html;charset=utf-8');
            res.end(str);
        }else{
            companyDao.search(q,function(err,data){
                if(err){
                    result = {
                        success : false,
                        msg : '检索失败,程序报错!'
                    };
                    res.setHeader('content-type', 'text/html;charset=utf-8');
                    res.end(JSON.stringify(result));
                }else{
                    var rows = data[0];
                    result = {
                        success : true,
                        msg : '检索成功!',
                        data : rows
                    };
                    res.setHeader('content-type', 'text/html;charset=utf-8');
                    res.end(JSON.stringify(result));
                }
            });
        }
    }
});

module.exports = router;