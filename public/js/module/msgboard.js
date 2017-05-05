
define(['jquery'],function($){
    var _sendMsg = function(content,fn){
        $.ajax({
            url : '/index/saveMsg',
            type : 'POST',
            data : content,
            success : function(res){
                if(fn)fn(res);
            }
        });
    };
    _getList = function(fn){
        $.ajax({
            url : '/index/getMsgList',
            type : 'POST',
            data : {},
            success : function(res){
                var arr = JSON.parse(res);
                fn(arr);
            }
        });
    };
    return {
        sendMsg : _sendMsg,
        getMsgList : _getList
    }
});