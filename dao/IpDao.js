// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var DBHelper = require('../config/DBHelper');
var sql = {
  save : "insert into proxyip (ip,port) values (?,?)",
  getIp : 'select * from proxyip where flag=0 limit 0,?',
  updateFlag : 'update proxyip set flag=? where id=?',
  delete : 'delete from proxyip where id=?',
  reset : 'update proxyip set flag=0'
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);

module.exports = {

  //获取最新的几天评论（任何）
  save : function(data,fn){
      var sqlarray = [{
        sql : sql.save,
        params : [data.ip,data.port]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  getIp : function(num,fn){
    var sqlarray = [{
      sql : sql.getIp,
      params : [num]
    }];
    DBHelper.getData(sqlarray,fn);
  },
  update : function(id,flag,fn){
    var sqlarray = [{
      sql : sql.updateFlag,
      params : [flag,id]
    }];
    DBHelper.getData(sqlarray,fn);
  },
  delete : function(id,fn){
    var sqlarray = [{
      sql : sql.delete,
      params : [id]
    }];
    DBHelper.getData(sqlarray,fn);
  },
  reset : function(fn){
    var sqlarray = [{
      sql : sql.reset,
      params : []
    }];
    DBHelper.getData(sqlarray,fn);
  }
  
};