/*
日常
**/



var superagent = require('superagent'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    mailer = require('./mailer'),
    moment = require('moment');
    // iconv = require('iconv-lite');

//1. 抓取知乎极客话题链接，推送到我的邮箱
var getGeekLink = function(callback){
    var zhihuHost = 'https://www.zhihu.com';
    var zhihuUrl = 'https://www.zhihu.com/topic/19552521/newest';
    // var zhihuUrl = 'https://www.zhihu.com/topic/19551119/hot';
    superagent.get(zhihuUrl)
    .end(function(err,res){
        if(err){console.log(err);}else{
            var $ = cheerio.load(res.text,{decodeEntities:false});
            var arr = '';
            $('.question_link').each(function(index,ele){
                var title = $(ele).html();
                var url = zhihuHost + $(ele).attr('href');
                arr += '<div><a href="'+url+'">'+title+'</a></div>';
            });
            if(callback){
                callback(arr);
            }
        }
    });
};
//2.抓取百思不得借的段子
var getJoker = function(callback){
    var url = 'http://www.budejie.com/new-text/';
    superagent.get(url).end(function(err,res){
        var text = res.text;
        var $ = cheerio.load(text,{decodeEntities:false});
        var $list = $('.j-r-list>ul>li');
        console.log($list.length);
        var data = [];
        $list.each(function(){
            var $li = $(this);
            var time = $li.find('.u-time').text();
            var text = $li.find('.j-r-list-c-desc').html();
            data.push(text);
        });
        if(callback)callback(data);
    });
};

var startGeek = function(){
    getGeekLink(function(arr){
        mailer('chrunlee@foxmail.com','知乎Geek话题内容',arr,function(){
            console.log('今日Geek话题以收集完成');
        });
    });
};
var startJoker = function(){
    getJoker(function(arr){
        mailer('chrunlee@foxmail.com','段子',arr.join('<br /><hr />'),function(){
            console.log('今日段子收集完毕');
        });
    });
};


//4.孙凤起华金签到

var startHuaJin = function(){
   //执行本地cmd 
   console.log('开始执行签到任务....');
   var exec = require('child_process').exec;
   exec('cd util && casperjs sign.js',function(err,stdout,stderr){
        console.log(stdout);
        exec('cd util && casperjs huajin.js',function(err2,stdout2,stderr2){
            console.log(stdout2);
            mailer('chrunlee@foxmail.com','签到','今日签到已完毕',function(){
                console.log('今日签到完毕');
            });
       });
   });
};

// 定义一个定时器，定时执行任务
var allstart = function(){
    var d = new Date();
    var d2 = new Date(d.getTime()+24*60*60*1000);
    var y = d2.getYear();
    var h = d2.getDate();
    var m = d2.getMonth();
    var d3 = new Date(y+1900,m,h);
    var time = d3.getTime() - d.getTime()+1000*60*60*8;
    setTimeout(function(){
        console.log('开始日常收集工作...');
        startGeek();
        startJoker();
        allstart();
    },time);
    //每天的11点-12点开始进行
    setTimeout(function(){
        startHuaJin();
    },1 * 10 * 1000);
};
module.exports = allstart;


