//音乐的dao
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var DBHelper = require('../config/DBHelper');
var sql = {
  
  getExplain : 'select txt from enwords where name=?'
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);



module.exports = {

  getExplain : function(name,fn){
    var sqlarray = [
    {
      sql : sql.getExplain,
      params : [name]
    }
    ];
    DBHelper.getData(sqlarray,fn);
  }

};