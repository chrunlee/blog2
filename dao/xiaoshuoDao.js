// 实现与MySQL交互
var DBHelper = require('../config/DBHelper');
var sql = {
  
  save : 'insert into xiaoshuo (id,name,author,updatetime,isdone,imagepath) values (?,?,?,?,?,?) ',
  create : 'insert into xiaoshuo (id) values (?) ',
  update : 'update xiaoshuo set name=?,author=?,updatetime=?,isdone=? where id=?',
  saveZj : 'insert into zhangjie (id,xiaoshuo,name,sortnum,content) values (?,?,?,?,?)',
  getCountOfId : 'select max(sortnum) as num from zhangjie where xiaoshuo=? ',
  getList : 'select * from xiaoshuo',
  getChapterList :'select * from zhangjie where xiaoshuo=? order by sortnum asc',
  getXiaoshuoById : 'select * from xiaoshuo where id=?',
  getXiaoshuoByChapter : 'select x.* from xiaoshuo x left join zhangjie c on x.id =c.xiaoshuo where c.id=?',
  getChapter : 'select * from zhangjie where id=? ' ,
  getPrevChpater : 'select * from zhangjie where xiaoshuo=(select xiaoshuo from zhangjie where id=?) and sortnum=(select sortnum-1 from zhangjie where id=?)',
  getNextChapter : 'select * from zhangjie where xiaoshuo=(select xiaoshuo from zhangjie where id=?) and sortnum=(select sortnum+1 from zhangjie where id=?)',
  updateImg : 'update xiaoshuo set imagepath=?,bookno=?,description=? where id=?',
  getAllZhangjie : 'select z.*,x.bookno from zhangjie z left join xiaoshuo x on z.xiaoshuo=x.id ',
  saveFile : 'select z.*,x.bookno from zhangjie z left join xiaoshuo x on z.xiaoshuo=x.id where z.id=?'
};

module.exports = {
  saveFile : function(zhangjieId,fn){
    var sqlarray = [{
      sql : sql.saveFile,
      params : [zhangjieId]
    }];
    DBHelper.getData(sqlarray,fn);
  },
  getAllZhangjie : function(fn){
    var sqlarray = [
    {
      sql : sql.getAllZhangjie,
      params : []
    }
    ];
    DBHelper.getData(sqlarray,fn);
  },
  create : function(id,fn){
    var sqlarray = [
    {
      sql : sql.create,
      params : [id]
    }
    ];
    DBHelper.getData(sqlarray,fn);
  },
  update : function(data,fn){
    var sqlarray = [{
      sql : sql.update,
      params : [data.name,data.author,data.updatetime,data.isdone,data.id]
    }];
    DBHelper.getData(sqlarray,fn);
  },
  saveZj : function(data,fn){
      var sqlarray = [{
        sql : sql.saveZj,
        params : [data.id,data.xiaoshuo,data.name,data.sortnum,data.content]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  getCountOfId : function(id,fn){
      var sqlarray = [{
        sql : sql.getCountOfId,
        params : [id]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  getList : function(fn){
      var sqlarray = [{
        sql : sql.getList,
        params : []
      }];
      DBHelper.getData(sqlarray,fn);
  },
  getChapterList : function(id,fn){
      var sqlarray = [
      {
        sql : sql.getXiaoshuoById,
        params : [id]
      },{
        sql : sql.getChapterList,
        params : [id]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  getContent : function(id,fn){
      var sqlarray = [{
        sql : sql.getXiaoshuoByChapter,
        params : [id]
      },{
        sql : sql.getChapter,
        params : [id]
      },{
        sql : sql.getPrevChpater,
        params : [id,id]
      },{
        sql : sql.getNextChapter,
        params : [id,id]
      }];
      DBHelper.getData(sqlarray,fn);
  },
  updateImg : function(data,fn){
      var sqlarray = [{
        sql : sql.updateImg,
        params : [data.img,data.no,data.description,data.id]
      }];
      DBHelper.getData(sqlarray,fn);
  }
};