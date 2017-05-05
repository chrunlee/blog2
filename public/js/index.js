require(
    ['jquery','module/common','module/msgboard','module/alertTool','../../plugins/layer/layer.js'],
    function($,common,msgboard,alertTool,abc){
        
        $('.index-box-undo').on('click',function(){
            layer.msg('功能开发中，暂未上线',{icon : 2});
        });
        //从cookie中读取，然后展示是否喜欢
        function getCookie(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg)){
                return unescape(arr[2]);    
            }else{
                return null;    
            }
        }
        function setCookie(name,value){
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        }
        var showLike = function(){
            var like = getCookie('like') || '';
            var arr = like.split(',');
            arr.forEach(function(ele,index){
                if(null != ele && ele != ''){
                    $('span#'+ele).addClass('haslike');
                }
            });
        };
        showLike();
        $('.addLikeBtn:not(.haslike)').on('click',function(event){
            event = event || window.event;
            var t = event.currentTarget,$t = $(t),id = $t.attr('id');
            $.ajax({
                url : '/index/addlike',
                type : 'POST',
                data : {id : id},
                success : function(res){
                    $t.prev().html('&nbsp;'+res+'人喜欢&nbsp;&nbsp;&nbsp;&nbsp;');
                    layer.msg('感谢点赞..',{icon :1});
                    //将该值存入cookie,刷新后还要存在
                    var like = getCookie('like') || '';
                    setCookie('like',like+','+id);
                    $t.addClass('haslike');
                }
            });
        });
    }
);