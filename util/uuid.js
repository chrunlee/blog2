//返回一个UUID
var uuid = require('node-uuid');
var getId = function(){
    return uuid.v4().replace(/-/g,'');     
}
module.exports = getId;
