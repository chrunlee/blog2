//音乐的dao
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var DBHelper = require('../config/DBHelper');
var sql = {
  
  save : 'insert into radio (title,author,b_pic,sid,ssid,len,pubtime,file_ext,sha256,b_url) values (?,?,?,?,?,?,?,?,?,?) ',
  checkSha : 'select count(1) as num from radio where sha256=?',
  count : 'select count(1) as num from radio',
  random : 'select * from radio order by RAND() limit 1,1',
  search : 'select id,title,author from radio where title like ? || author like ? ',
  getById : 'select * from radio where id=? ',
  getBySid : 'select * from radio where sid=?',
  getBySha : 'select * from radio where sha256=?'
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);



module.exports = {

  //获取最新的几天评论（任何）
  save : function(data,fn){
      var sqlarray = [{
        sql : sql.save,
        params : [
        	data.title,
        	data.author,
        	data.b_pic,
        	data.sid,
        	data.ssid,
        	data.len,
        	data.pubtime,
        	data.file_ext,
        	data.sha256,
        	data.b_url
        ]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  checkSha : function(sha,id,title,fn){
    //检查不重复的1.查看sid 有没有重复的，如果没有重复，则检查sha256有重复的没，如果没有，则没有重复，如果sha256重复，查找出来比对title，如果一样，则重复，不一样则不重复，如果SID 不重复，则查找sha256有没有重复的。
  	var sqlarray = [
  	{
  		sql : sql.getBySid,
  		params : [id]
  	},{
      sql : sql.getbySha,
      params : [sha]
    }];

  	DBHelper.getData(sqlarray,function(err,datas){
      var iddata = datas[0];
      var shadata = datas[1];
      //1.查看id是否有重复
      var flag = false;
      if(iddata.length > 0){//有重复
        iddata.forEach(function(item,index){
          if(item.title == title){
            flag = true;
          }
        });
      }else{//没有id重复的
        if(shadata.length > 0){//sha重复
          shadata.forEach(function(item,index){
            if(item.title == title){
              flag = true;
            }
          });
        }else{
          flag = false;
        }
      }
      fn(flag);
    });
  },
  count : function(sha,fn){
  	var sqlarray = [
  	{
  		sql : sql.count,
  		params : []
  	}];
  	DBHelper.getData(sqlarray,fn);
  },
  random : function(fn){
  	var sqlarray = [
  	{
  		sql : sql.random,
  		params : []
  	}];
  	DBHelper.getData(sqlarray,fn);
  },
  search : function(title,fn){
    title = '%'+title+'%';
    var sqlarray = [
    {
      sql : sql.search,
      params : [title,title]
    }
    ];
    DBHelper.getData(sqlarray,fn);
  },
  getById : function(id,fn){
    var sqlarray = [
    {
      sql : sql.getById,
      params : [id]
    }
    ];
    DBHelper.getData(sqlarray,fn);
  }
};