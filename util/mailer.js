/***
 * 邮件发送工具
 * @author lx
 * @since 2016年8月12日 21:26:42
 *
 ***/

var nodemailer = require('nodemailer');
var log = require('../util/logUtil');

// create reusable transporter object using the default SMTP transport
// var transporter = nodemailer.createTransport({
//     pool : true,
//     host : 'smtp.qq.com',
//     port : 465,
//     secure : true,
//     auth : {
//         user : 'chrunlee@foxmail.com',
//         pass : 'lixun53542306~~'
//     }
// });

var transporter = nodemailer.createTransport('smtps://chrunlee@foxmail.com:rhllpmgzpdnnbeae@smtp.qq.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '程序员百宝箱 <chrunlee@foxmail.com>', // sender address
    to: '', // list of receivers
    subject: '', // Subject line
    html: '' // html body
};

// send mail with defined transport object

var sendMail = function(userList,title,content,fn){
    mailOptions.to = userList;
    mailOptions.subject = title;
    mailOptions.html = content;
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return log(error);
        }
        if(fn)fn(info);
    });
}

module.exports = sendMail;