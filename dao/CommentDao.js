/***
评论的增删改查
***/
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var DBHelper = require('../config/DBHelper');
var sql = {
  
  saveComment : "insert into liuyanban (id,content,createtime,name,email,avatar,appid) values (?,?,?,?,?,?,?)",
  getList : 'select * from liuyanban where appid=? order by createtime desc limit ?,?',
  getCount : 'select count(1) as count from liuyanban where appid=?',
  getById : 'select commentnum from article where id=?',
  updateNum : 'update article set commentnum=? where id=?',
  getNewList : 'select * from liuyanban order by createtime desc limit 0,?'
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);



module.exports = {

  //获取最新的几天评论（任何）
  getNewList : function(num,fn){
      var sqlarray = [{
        sql : sql.getNewList,
        params : [num]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  saveComment : function(data,fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.saveComment,[data.id,data.content,data.createtime,data.name,data.email,data.avatar,data.appid],function(err2,result){
        if(err2)throw err2;
        //如果是文章的评论，则加1评论数量

        if(data.appid.length > 5){
          connection.query(sql.getById,data.appid,function(err3,numr){
            var num = numr[0].num||0;
            num = parseInt(num,10);
            num ++ ;
            connection.query(sql.updateNum,[num,data.appid],function(err4,rrr){
              fn(result);
              connection.release();
            });
          });
        }else{
          fn(result);
          connection.release();
        }
      });
    });
  },
  getList : function(id,start,rows,fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.getCount,id,function(err3,countData){
        var total = countData[0].count;
        connection.query(sql.getList,[id,start,rows],function(err2,result){
          if(err2)throw err2;
          fn(result,total);
          connection.release();
        });
      });
    });
  }
};