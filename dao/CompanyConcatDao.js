// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var DBHelper = require('../config/DBHelper');
var sql = {
  search : "select * from company_concat where employ_name like ?  ",
  save : 'insert into company_concat (company_name,department_name,employ_no,employ_name,phone,mobile,mobile2,email,email2,update_time,remark) values (?,?,?,?,?,?,?,?,?,?,?) '
};

var pool  = mysql.createPool($conf.mysql);

module.exports = {
  //search
  search : function(keywords,fn){
      keywords = '%'+keywords+'%';
      var sqlarray = [{
        sql : sql.search,
        params : [keywords]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  save : function(obj,fn){
    var sqlarray = [{
        sql : sql.save,
        params : [obj.dname,obj.bname,obj.bh,obj.name,obj.phone,obj.mobile,obj.mobile2,obj.email,obj.email2,obj.update,obj.remark]
      }];
      DBHelper.getData(sqlarray,fn);
  }
};