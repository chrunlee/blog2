define(function(){

    return {
        alert : function(title,content){
            alert(content || title);
        },
        confirm : function(title,content,okfn,cancelfn){
            var v = confirm(title,content);
            if(v == '是'){
                okfn();
            }else{
                cancelfn();
            }
        }
    };
});