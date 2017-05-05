// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var sql = {
  
  validateEmail : 'select count(1) as num from user where email=? ',

  insert : 'insert into user (id,email,pwd,name) values (?, ?, ?, ?)',

  login :  'select *  from user where email=? and pwd=? ',

  getById : 'select * from user where id=? ',

  updateValid : 'update user set validateemail=1 where id=? '
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);



module.exports = {

  updateValid : function(id){
    pool.getConnection(function(err, connection) {
      connection.query(sql.updateValid, [id], function(err, result) {
        if(err){
          log(err.toString());
        }
        connection.release();
      });
    });
  },
  login : function(data,fn){
    pool.getConnection(function(err, connection) {
      connection.query(sql.login, data, function(err, result) {
        var user = {};
        if(err){
          log(err.toString());
        }else{
          user = result[0];
        }
        if(fn)fn(user);
        connection.release();
      });
    });
  },
  validateEmail: function (email,fn) {
    pool.getConnection(function(err, connection) {
      connection.query(sql.validateEmail, [email], function(err, result) {
        var num = -1;
        if(err){
          log(err.toString());
        }else{
          num = result[0].num;
        }
        if(fn)fn(num);
        connection.release();
      });
    });
  },
  insertUser : function(data,fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.insert,data,function(err2,result){
        if(err)throw err;
        fn(result);
        log('Table : User ,Action : insert ,Id : 无 , des : 插入一条用户记录');
        connection.release();
      });
    });
  },
  getById : function(id,fn){
    pool.getConnection(function(err,connection){
      connection.query(sql.getById,id,function(err2,result){
        fn(result); 
        log('Table : User ,Action : query ,Id : '+id+' , des : 查询ID为'+id+'的用户qq');
        connection.release();
      });
    });
  }
};