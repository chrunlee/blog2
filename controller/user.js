var express =require('express');
var userDao = require('../dao/UserDao');
var log = require('../util/logUtil');
var router = express.Router();

/**=======================GET请求==================**/
//跳转到登录页面
router.get('/',function(req,res,next){
    res.redirect('login');
});
//跳转到登录页面
router.get('/login',function(req,res,next){
    res.render('login');
});

//跳转到注册页面
router.get('/register',function(req,res,next){
    res.render('register');
});
//用户登出操作
router.get('/logout',function(req,res,next){
    // req.session = null;
    var logoutemail = req.session.email;
    req.session.userid = '';
    req.session.username ='';
    req.session.email = '';
    log('用户 : '+logoutemail+' 退出！');
    res.redirect('/index'); 
});
//跳转到注册成功页面
router.get('/register-suc',function(req,res,next){
    var session = req.session;
    var email = session.email || '';
    var result = {
        title : '恭喜您，注册成功',
        content : '邮件已发送至<a href="">'+email+'</a>,请登录校验！'
    };
    res.render('info',result);
});

//邮箱校验
router.get('/valid',function(req,res,next){
    var query = req.query;
    var id = query.id;
    var result = {
        title : '校验失败',
        content : '可能打开的方式不太对，请重新打开一次！'
    };
    if(id){
        //检查该ID的用户是否存在，邮箱是否激活
        userDao.getById(id,function(data){
            if(data.length > 0){
               result = {
                title : '恭喜您，邮箱验证成功！',
                content : '邮箱验证成功，您可以<a href="/user/login">点这里</a>登录！'
               };
               //更新邮箱的状态
               userDao.updateValid(id);
                res.render('info',result);

            }else{
                //未注册，或者参数不正确。
                res.render('info',result);
            }
        });
    }else{
        res.render('info',result);
    }
});

/**===================POST 提交=======================**/

//登录表单提交
router.post('/login',function(req,res,next){
    var email = req.body.email,pwd = req.body.password;
    //检查是否符合条件

    userDao.login([email,pwd],function(user){
        if(user && user.id){
            //登录成功
            req.session.userid = user.id;
            req.session.username = user.name;
            req.session.email = user.email;
            log('用户：'+email+' , 登录成功!');
            res.redirect('/index');
        }else{
            res.render('login',{'msg':'登录失败，用户名或密码不正确！'});
        }
    });
});

//注册表单提交
router.post('/register',function(req,res,next){
    var body = req.body;
    //数据库验证及保存更新
    var name = body.name,email = body.email,pwd = body.pwd,id = require('../util/uuid')();
    //提交之前先检测一遍邮箱是否重复
    userDao.validateEmail(email,function(num){
        if(num > 0){
            res.end('{msg : "邮箱已注册",suc : false}');
        }else{
            try{
                userDao.insertUser([id,email,pwd,name],function(result){
                    //保存成功，保存session
                    req.session.email = email;
                    req.session.validate = false;
                    //发送邮件
                    // var content = '非常感谢您注册“程序员的百宝箱”网站，以下为验证邮箱的链接：<a href="http://localhost:3333/user/valid?id='+ id+'">邮箱校验</a>';
                    var link = 'http://www.gcoder.win/user/valid?id='+id;
                    var fs = require('fs');
                    var content = fs.readFileSync('./util/mailTemplate.html');
                    content = content.toString();
                    content = content.replace('{{name}}',name);
                    content = content.replace('{{link}}',link).replace('{{link}}',link).replace('{{link}}',link).replace('{{link}}',link);
                    require('../util/mailer')(email,'注册成功',content,function(info){
                        // console.log(info);
                        log('邮件发送成功 to '+email);
                    });
                    res.end('{msg:"注册成功",suc : true}');
                });
            }catch(e){
                res.end('{msg:"保存失败，请重试"},suc : false');
            }
        }
    });
    
});
//注册的时候验证邮箱是否已经注册
router.post('/validateEmail',function(req,res,next){
    var email = req.body.email;
    var validateResult = false;
    if(email){
        userDao.validateEmail(email,function(num){
            res.end(num == 0 ? 'true' : 'false');
        });
    }else{
        res.end('false');
    }
});

//获取登录用户的信息
router.post('/info',function(req,res,next){
    if(req.session.userid){
        var result = {
            name : req.session.username,
            id : req.session.userid,
            email : req.session.email,
            suc : true
        };
        res.end(JSON.stringify(result));
    }
    res.end('{suc:false}');
});

/**========================请求结束==============================**/

module.exports = router;