/*** 
 * 获取登录用户的信息
 * @author lx
 * @since 2016年8月12日 14:03:40
****/

var xmlHttpRequest;
if(window.XMLHttpRequest){
    xmlHttpRequest = new XMLHttpRequest();
    if(xmlHttpRequest.overrideMimeType){
        xmlHttpRequest.overrideMimeType('text/xml');
    }
}else if(window.ActiveXObject){
    var activeName = ['MSXML2.XMLHTTP','Microsoft.XMLHTTP'];
    for(var i=0,max=activeName.length;i<max;i++){
        try{
            xmlHttpRequest = new ActiveXObject(activeName[i]);
            break;
        }catch(e){}
    }
}
if(null == xmlHttpRequest){
    console.log('创建失败');
}else{
    //注册回调函数
    xmlHttpRequest.onreadystatechange = function(abc){
        if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
            var res = xmlHttpRequest.responseText;
            var resobj = eval('('+res+')');
            console.log(resobj);
            var target = document.getElementById('headerLoginInfo');
            if(resobj.suc === true || resobj.suc === 'true'){
                //登录成功斌刚修改信息
                var name = resobj.name;
                target.setAttribute('href','');
                //移除注册按钮
                document.getElementById('registerButton').remove();
                target.innerHTML = name;
            }else{
                //不处理
                target.setAttribute('href','/user/login');
                target.setAttribute('class','')
            }
        }
    }
    //请求访问
    xmlHttpRequest.open('POST','/user/info',true);
    xmlHttpRequest.send(null);
}
window.onload = function(){
    var u = location.href;
    var ulObj = document.getElementById('headermenu');
    var liObj = ulObj.childNodes;
    liObj.forEach(function(ele,index){
        if(ele.nodeName == 'LI'){
            ele.removeAttribute('class');
            var urlstr = ele.getAttribute('url');
            var urlArray = urlstr.split(',');
            var flag = false;
            urlArray.forEach(function(tempUrl,uindex){
                if(u.indexOf(tempUrl) > -1){
                    flag = true;
                }
            });
            if(flag){
                ele.setAttribute('class','active');
            }
        }
    });
};