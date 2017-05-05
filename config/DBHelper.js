/**数据库工具类**/
var mysql = require('mysql');
var $conf = require('../config/dataSource');
var async = require('async');
// 使用连接池，提升性能
// var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);

//1. 执行语句返回结果
var onebyone = function(list,callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            var funcAry = [];
            list.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param||[], function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                throw tErr;
                            });
                        } else {
                            return cb(null, rows);
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.parallel(funcAry, function (err, result) {
                if (err) {
                    connection.rollback(function (err2) {
                        connection.release();
                        // connection.destroy();
                        return callback(err2, null);
                    });
                } else {
                    connection.commit(function (err2, info) {
                        if (err2) {
                            console.log("执行事务失败，" + err2);
                            connection.rollback(function (err3) {
                                connection.release();
                                // connection.destroy();
                                return callback(err3, null);
                            });
                        } else {
                            connection.release();
                            // connection.destroy();
                            return callback(null, result);
                        }
                    })
                }
            });
        });
    });
};


module.exports = {
    getData : onebyone
};