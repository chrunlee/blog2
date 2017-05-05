//前台翻译的JS
require.config({
    // baseUrl : './',
    paths : {
        jquery : 'jquery'
    }
});

require(['jquery'],function($){
    var now = 0;
    $('textarea[name="input"]').on('keyup',function(){
        //两秒以上则发送请求
        var v = $('textarea[name="input"]').val();
        if(v.trim() != ''){
            var d=  new Date();
            var dn = d.getTime();
            now = dn;
            setTimeout(function(){
                var n = new Date();
                var nn = n.getTime();
                if(nn - now >= 2000){
                    //执行
                    goSearch();
                }
            },2000);
        }
    });

    var goSearch = function(){
        console.log('incoming');
        var v = $('textarea[name="input"]').val();
        $.ajax({
            url : '/translate/post',
            type : 'POST',
            data : {
                query : v
            },
            success : function(res){
                console.log(res);
            }
        });
    };
    
});