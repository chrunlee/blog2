var comment = function(){
    //设置随机头像
    var setRandomPic = function(){
        var num = (Math.random()*38).toFixed(0);
        num = parseInt(num,10);
        num ++ ;
        $('#avatar').attr('src','/avatar/'+num+'.jpg');
    };
    //改变自己
    var changeThis = function(){
        setRandomPic();
    };
    var htmlencode = function(content){
        //对内容进行encode 
        var tempNode = document.createElement('div');
        tempNode.appendChild(document.createTextNode(content));
        return tempNode.innerHTML;
    };
    var saveComment = function(){
        var name = $('#commentname').val();
        var content = $('#commentcontent').val();
        content = htmlencode(content);
        var appid = $('#appid').val();
        var avatarsrc = $('#avatar').attr('src');
        layer.load();
        $.ajax({
            url : '/comment/saveComment',
            type : 'POST',
            data : {
                appid : appid,
                name : name,
                content : content,
                avatar : avatarsrc
            },
            success : function(msg){
                layer.closeAll('loading');
                layer.msg(msg,{icon : 6});
                $('#commentname').val('');
                $('#commentcontent').val('');
                loadList();
            }
        });
    };
    var loadList = function(page){
        page = page || {page : 1,rows : 10};
        var appid = $('#appid').val();
        $.ajax({
            url : '/comment/getList',
            type : 'POST',
            data : {
                appid : appid,
                page : page.page,
                rows : page.rows
            },
            success : function(res){
                var data = eval('('+res+')');
                var resobj = data.rows,total = data.total;
                $('.commentNum').html(total+'条评论');
                var $ul = $('#commentData');
                if(resobj.length > 0){
                    $ul.html('');
                    resobj.forEach(function(obj,index){
                        var avatar = obj.avatar,
                            content = obj.content,
                            name = obj.name,
                            createtime = obj.createtime.replace('T',' ').substring(0,16);
                        content = content.replace(/\n/g,'<br />');
                        var $li = $('<li></li>'),
                            $avatar = '<span class="avatar"><img src="'+avatar+'" /></span>',
                            $comment = '<div class="comment"><a href="">'+name+'</a><div class="content">'+content+'</div><div class="time">'+createtime+'</div>';
                        $li.append($avatar).append($comment);
                        $ul.append($li);
                    });
                    pagination.init({
                        count : total,
                        page : page.page,
                        pagesize : page.rows,
                        callback:function(p){
                            loadList(p);
                        }
                    });
                }else{
                    $ul.append('<li style="border:none;" id="emptyLi"><p style="text-align:center;height:100px;line-height:50px;">一个评论还没有呢..来来，喝杯92年的矿泉水再走.</p></li>');
                }
                suitScreen();
            }
        });
    };

    return {
        setRandomPic : setRandomPic,
        loadList : loadList,
        saveComment : saveComment,
        changeThis : changeThis
    };
}();


$(function(){
    //加载数据
    comment.loadList();
    comment.setRandomPic();
    //绑定事件
    $('.avatarPic').on('click',function(){
        comment.changeThis();
    });
    $('.comment-submit-btn').on('click',function(){
        comment.saveComment();
    });
});