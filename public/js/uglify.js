require.config({
    // baseUrl : './',
    paths : {
        jquery : 'jquery'
    }
});

require(['jquery'],function($){
    var sendData = function(type,content){
        var $target = $('textarea[name="input"]');
        $.ajax({
            url : '/jstool/compress',
            type : 'POST',
            data : {content : content,type : type},
            success : function(res){
                $target.val(res);
            }
        });
    };

    $('span.btn[name="yasuo"]').on('click','',function(){
        var $target = $('textarea[name="input"]');
        var content = $target.val();
        sendData('yasuo',content);
    });

    $('span.btn[name="hunxiao"]').on('click','',function(){
        var $target = $('textarea[name="input"]');
        var content = $target.val();
        sendData('hunxiao',content);
    });

    $('span.btn[name="meihua"]').on('click','',function(){
        var $target = $('textarea[name="input"]');
        var content = $target.val();
        sendData('meihua',content);
    });

     $('span.btn[name="comment"]').on('click','',function(){
        var $target = $('textarea[name="input"]');
        var content = $target.val();
        sendData('comment',content);
    });

    $('span.btn[name="select"]').on('click','',function(){
        var $target = $('textarea[name="input"]');
        $target[0].select();
    });
    
});