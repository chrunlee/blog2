// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var sql = {
  
  getList : "select * from app where enable=1 ",
  updateLike : 'update app set likecount=? where id=? ',
  getById : 'select * from app where id=?',
  getLike : 'select likecount from app where id=?'
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);



module.exports = {

  getById : function(id,fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.getById,id,function(err2,result){
        if(err2)throw err2;
        fn(result);
        connection.release();
      });
    });
  },
  getList : function(fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.getList,[],function(err2,result){
        if(err2)throw err2;
        fn(result);
        connection.release();
      });
    });
  },
  addLike : function(id,fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.getLike,[id],function(err2,result){
        if(err2)throw err2;
        var obj = result[0];
        var likecount = obj.likecount;
        likecount++;
        connection.query(sql.updateLike,[likecount,id],function(err3,result){
          fn(likecount);
          connection.release();
        });
      });
    });
  }
};