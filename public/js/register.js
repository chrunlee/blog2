/**
 *用户注册
 *@author lx
 *@since 2016年8月12日 11:27:29
***/
require(['domReady','jquery','module/alertTool'],function(domReady,$,alertTool){
    domReady(function(){
        //1.绑定事件
        $('#email').blur(function(){
            var $ipt = $(this);
            var v = $ipt.val();
            if(/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(v)){
                $('#emailmsg').html('');
                $.ajax({
                    url : '/user/validateEmail',
                    type : 'POST',
                    data : {
                        email : v
                    },
                    success : function(res){
                        if(res === 'true'){
                            $('#emailmsg').html('邮件通过校验，可以注册！');
                            $ipt.removeClass('valid-error').addClass('valid-suc');
                        }else{
                            $('#emailmsg').html('该邮箱已注册！');
                            $ipt.removeClass('valid-suc').addClass('valid-error');
                        }
                    }
                });
            }else{
                $('#emailmsg').html('填写的邮箱不符合规范');
                $ipt.removeClass('valid-suc').addClass('valid-error');
            }
        });
        //2.用户名
        $('input[name="name"]').blur(function(){
            var $ipt = $(this);
            var v = $ipt.val();
            if(v.trim() == ''){
                $ipt.removeClass('valid-suc').addClass('valid-error');
                $('#namemsg').html('用户名不能为空');
            }else{
                $ipt.removeClass('valid-error').addClass('valid-suc');
                $('#namemsg').html('');
            }
        });
        //3.密码
        $('input[name="pwd"]').blur(function(){
            var $ipt = $(this);
            var v = $ipt.val();
            if(v.trim() == ''){
                $ipt.removeClass('valid-suc').addClass('valid-error');
                $('#pwdmsg').html('密码不能为空');
            }else{
                $ipt.removeClass('valid-error').addClass('valid-suc');
                $('#pwdmsg').html('');
            }
        });
        //4.提交
        $('input[name="submit"]').click(function(){
            //检查是否还有未通过的校验
            if($('.valid-suc').length != 3){
                $('input[name="name"]').blur();
                $('input[name="email"]').blur();
                $('input[name="pwd"]').blur();
            }
            if($('.valid-error').length == 0){
                var name = $('input[name="name"]').val().trim();
                var email = $('input[name="email"]').val().trim();
                var pwd = $('input[name="pwd"]').val().trim();
                $.ajax({
                    url : '/user/register',
                    type : 'POST',
                    data : {
                        name : name,
                        email : email,
                        pwd : pwd
                    },
                    success : function(res){
                        var resobj = eval('('+res+')');
                        if(resobj.suc === true || resobj.suc ==='true'){
                            location.replace('/user/register-suc');
                        }else{
                            alertTool.alert(resobj.msg);
                        }
                    }
                });
            }
        });
    });
});