require.config({
    // baseUrl : './',
    paths : {
        jquery : 'jquery'
    }
});

require(['jquery'],function($){

    $('span.btn[name="beautify"]').on('click','',function(){
        var $target = $('textarea[name="input"]');
        var $output = $('textarea[name="output"]');
        var content = $target.val();
        $.ajax({
            url : '/jsontool/beautify',
            type : 'POST',
            data : {content : content},
            success : function(res){
                $output.val(res);
            }
        });
    });
    
});