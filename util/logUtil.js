/**
 * 记录日志或者控制台打印数据
 * @author lx
 * @since 2016年8月14日 17:04:32
 * @1.控制台打印 2.文件记录 3.数据库记录 4.信息齐全
 ***/
 var loglevel = 2;//打印级别
 var fs = require('fs');
 var logutil = function(msg){
    if( typeof(msg) ==  'object'){
        msg = msg.toString();
    }
    var d = new Date();
    var now = d.toLocaleString();
    var msginfo = now +' : '+ msg + '\r\n';
    
    if(loglevel === 1){
        //控制台
        console.log(msginfo);    
    }else if(loglevel === 2){
        //输出到文件中
        fs.appendFile('log.txt',msginfo);
    }else if(loglevel === 3){
        //存储数据库中
        console.log(msginfo);
    }
 };

 module.exports = logutil;