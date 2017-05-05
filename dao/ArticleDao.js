var mysql = require('mysql');
var $conf = require('../config/dataSource');
var log = require('../util/logUtil');
var DBHelper = require('../config/DBHelper');
var sql = {
  
  getById : "select id,title,date_format(createtime,'%Y-%m-%d %H:%i') as createtime,author,content,type,summary,readnum,commentnum from article where id=? ",
  saveArticle : 'insert into article (id,title,createtime,author,content,type,summary,readnum,commentnum) values (?,?,?,?,?,?,?,0,0) ',
  updateArticle : 'update article set content=? where id=? ',
  getRandomArticle : 'SELECT * FROM article ORDER BY RAND()  LIMIT 10',
  getList : "select id,title,date_format(createtime,'%Y-%m-%d %H:%i') as createtime,author,content,type,summary,readnum,commentnum from article order by createtime desc limit ?,?",
  getCount : 'select count(1) as num from article',
  getReadList : 'select * from article order by readnum desc limit 10',
  updateReadNum : 'update article set readnum=? where id=? ',
  getTypeList : 'select type,count(1) as num from article group by type',
  getDateList : "select date_format(createtime,'%Y-%m') as date,count(1) as num from article group by date_format(createtime,'%Y-%m') order by date desc ",
  getListOfType : "select id,title,date_format(createtime,'%Y-%m-%d %H:%i') as createtime,author,content,type,summary,readnum,commentnum  from article where type=? order by createtime desc limit ?,?",
  getCountOfType : 'select count(1) as num from article where type=? ',
  getListOfDate : "select id,title,date_format(createtime,'%Y-%m-%d %H:%i') as createtime,author,content,type,summary,readnum,commentnum  from article where date_format(createtime,'%Y-%m')=? order by createtime desc limit ?,?",
  getCountOfDate : 'select count(1) as num from article where date_format(createtime,"%Y-%m")=?',
  getQueryList : "select id,title,date_format(createtime,'%Y-%m-%d %H:%i') as createtime,author,content,type,summary,readnum,commentnum  from article where title like ? order by createtime desc limit ?,?",
  getCountOfQuery : "select count(1) as num from article where title like ? "
};

// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);



module.exports = {
    updateReadNum : function(id){
      pool.getConnection(function(err,connection){
        connection.query(sql.getById,id,function(err3,result){
          var d = result[0].readnum || 0;
          d ++ ;
          connection.query(sql.updateReadNum,[d,id],function(err2,result){
            if(err2)throw err2;
            connection.release();
          });
        });
      });
    },
    getCount : function(fn){
      var sqlarray = [{
        sql : sql.getCount,
        params : []
      }];
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
    },
    saveArticle : function(data,fn){
      var sqlarray = [{
        sql : sql.saveArticle,
        params : [data.id,data.title,data.createtime,data.author,data.content,data.type,'']
      }];
      DBHelper.getData(sqlarray,fn);
    },
    updateArticle : function(id,content,fn){
      var sqlarray = [{
        sql : sql.updateArticle,
        params : [content,id]
      }];
      DBHelper.getData(sqlarray,fn);
    },
    getRandom : function(fn){
      var sqlarray = [{sql : sql.getRandomArticle,params:[]}];
      DBHelper.getData(sqlarray,fn);
    },
    getList : function(start,end,fn){
        var sqlarray = [
        {
          sql : sql.getList,
          params : [start,end]
        },
        {
          sql : sql.getReadList,
          params : []
        },
        {
          sql : sql.getCount,
          params : []
        },
        {
          sql : sql.getTypeList,
          params : []
        },
        {
          sql : sql.getDateList,
          params : []
        }
        ];
        DBHelper.getData(sqlarray,fn);
    },
    getTypeList :function(start,end,type,fn){
        var sqlarray = [
        {
          sql : sql.getListOfType,
          params : [type,start,end]
        },
        {
          sql : sql.getReadList,
          params : []
        },
        {
          sql : sql.getCountOfType,
          params : [type]
        },
        {
          sql : sql.getTypeList,
          params : []
        },
        {
          sql : sql.getDateList,
          params : []
        }
        ];
        DBHelper.getData(sqlarray,fn);
    },
    getDateList : function(start,end,date,fn){
      var sqlarray = [
        {
          sql : sql.getListOfDate,
          params : [date,start,end]
        },
        {
          sql : sql.getReadList,
          params : []
        },
        {
          sql : sql.getCountOfDate,
          params : [date]
        },
        {
          sql : sql.getTypeList,
          params : []
        },
        {
          sql : sql.getDateList,
          params : []
        }
        ];
        DBHelper.getData(sqlarray,fn);
    },
    getQueryList : function(start,end,search,fn){
      var sqlarray = [
        {
          sql : sql.getQueryList,
          params : ['%'+search+'%',start,end]
        },
        {
          sql : sql.getReadList,
          params : []
        },
        {
          sql : sql.getCountOfQuery,
          params : ['%'+search+'%']
        },
        {
          sql : sql.getTypeList,
          params : []
        },
        {
          sql : sql.getDateList,
          params : []
        }
        ];
        DBHelper.getData(sqlarray,fn);
    },
    getView : function(id,fn){  
      var sqlarray = [
        {
          sql : sql.getById,
          params : [id]
        },
        {
          sql : sql.getReadList,
          params : []
        },
        {
          sql : sql.getTypeList,
          params : []
        },
        {
          sql : sql.getDateList,
          params : []
        }
        ];
        DBHelper.getData(sqlarray,fn);
    }
};