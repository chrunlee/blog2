/**
 * bootstrap 对应的独立分析组件
 * @demo 
 *      pagination.init({
 *          selector : '.page', //选择器，作为渲染目标,默认为 '.page.pagination',非必须
 *          count : 120,        //为总记录数，必须
 *          isTransform : false,//是否转换为符合后台需要的参数begin /end
 *          page : 1,           //为当前页码，非必须
 *          pagesize : 10,      //为每页条数，默认10，非必须
 *          increment : 10,     //为页面存在的分页增量，比如只显示5个页码，非必须
 *          pageArray : [],     //可以进行生成下拉框，比如 10，20，50 ，选择不同的页码进行分页，非必须
 *          previousTitle : '点击查看',//为上一页的title显示，未实现；
 *          callback : function(pageObject){//为分页点击回调函数，必须
 *              console.log(pageObject);//pageObject= {page : 1,pagesize:10};回调函数返回值，包括下一个页码和每页条数
 *          }
 *      });
 * @since 2016年2月15日 15:18:36
 * @author lixun
 * @version 1.0
 * @edited by lixun ,增加多实例；一个页面多个分页 ；
 * 处理思路：
 *  1. 对应的每个selector有一个pagination,然后在调用的时候根据selector进行查找
 *  2. 处理的内容：1）分页加载；2）事件绑定 3）回调函数 
 *  3. 处理原则：平滑处理，原有的可继续使用；
 */
var pagination = {
    _defaultSelector : '.page .pagination', //默认选择器
    _defaultPagesize : 10,                  //默认分页条数
    _defaultIncrement : 10,                 //默认分的页码数
    _defaultPageArray : [],                 //默认的条码下拉框
    _map : {    //用户处理多实例增加的容器，不可覆盖
        //selector : {私有属性}
        //".page .column" : {}
    },
    //通用属性
    lastSelector : '',//上一个选择器，用于开发者不传递参数的时候，去查找上一个选择器用的。
    previousTitle : '上一页',
    nextTitle : '下一页',
    previousContent : '上一页',
    nextContent : '下一页',
    //获得分页实例
    _getPagination : function(selector){
        if(null != selector && selector != '' && $(selector).length > 0){
            return pagination._map[selector];
        }else{
            console.error('selector 传参错误或$('+selector+')不存在！');
        }
        return null;
    },
    //获得返回的字符串
    pageArrayStr : function(selector,ps){
        var pa = pagination._map[selector].pageArray;
        if(null != pa && pa.length > 0){
            var concatStr = '<select onchange="pagination.changePagesize(\''+(selector)+'\',event)" style="height:20px;line-height:20px;padding:0px;margin-top:-2px;">';
            var i=0,max=pa.length;
            for(;i<max;i++){
                var v = pa[i];
                concatStr += '<option value="'+v+'" '+(v == ps ? 'selected="true"' : '')+'>'+v+'</option>';
            }
            concatStr += '</select>';
            return concatStr;
        }
        return "";
    },
    
    //绑定事件
    bindEvent : function(selector){
        if(selector && selector != ''){
            var _tempPaginationInstance = pagination._map[selector] || {};
            var _bindE = _tempPaginationInstance.bindE == true ? true : false;
            if(_bindE == false){
                _tempPaginationInstance.bindE = true;
                pagination._map[selector] = _tempPaginationInstance;
                //跳转页面
                $(selector).delegate('li.unselect','click',pagination.clickpage);
                //绑定上一页事件
                $(selector).delegate('li.pageup','click',pagination.pageup);
                //绑定下一页事件
                $(selector).delegate('li.pagedown','click',pagination.pagedown);
                //绑定前面页面事件
                $(selector).delegate('a.previous','click',pagination.previouspage);
                //绑定后面页面事件
                $(selector).delegate('a.next','click',pagination.nextpage);
            }
        }
    },
    //分页初始化
    init : function(params){
        //处理传参数据
        params = params || {};
        params.count = params.count || 0;
        params.pagesize = params.pagesize || pagination._defaultPagesize;
        var paramSelector = pagination._defaultSelector;
        if(params.selector){
            paramSelector = params.selector;
        }
        //获得选择器后，进行实例处理
        var paginationInstance = pagination._getPagination(paramSelector);
        //传参获取最新配置
        var tempPaginationInstance = {
            selector : paramSelector,
            page : params.page ? params.page : (paginationInstance && paginationInstance.action == true ? (paginationInstance.page ? paginationInstance.page : 1) : 1),
            count : params.count || 0,
            action : false,
            bindE : false,//是否绑定事件
            pagesize : params.pagesize,
            callback : params.callback || $.noop,
            pagenumber : (parseInt((params.count || 0)/(params.pagesize||pagination._defaultPagesize),10)+((params.count||0)%(params.pagesize||pagination._defaultPagesize)==0 ? 0 : 1)),//根据总数和一页条数获得页码数量
            increment :  params.increment || pagination._defaultIncrement,
            pageArray : params.pageArray || pagination._defaultPageArray
        };
        if(paginationInstance && undefined != paginationInstance){
            //存在实例,进行更新。
            tempPaginationInstance.bindE = true;//如果存在的话，肯定绑定了
            pagination._map[paramSelector] = $.extend(paginationInstance,tempPaginationInstance);
        }else{
            pagination._map[paramSelector] = tempPaginationInstance;//重新赋值
            pagination.bindEvent(paramSelector);//绑定事件
        }
        pagination.loadPage(paramSelector);
        pagination.lastSelector = paramSelector;
    },
    //点击页面数直接跳转
    clickpage : function(){
        var $a = $(this).find('a');
        var selector = $a.attr('selector');
        var gonumber = parseInt($a.html(),10);
        $(selector+' li.active').addClass('unselect').removeClass('active');
        $(this).addClass('active').removeClass('unselect');
        pagination.gopage(selector,gonumber);
    },
    //向上翻页
    pageup :  function(){
        var $a = $(this).find('a');
        var selector = $a.attr('selector'),
        className = $a.parent().attr('class');
        if(className.indexOf('disabled') > -1){
            return false;
        }
        //得到当前页面，然后翻页，如果在边界，那么就要进行触发一次翻页事件
        var  $actel = $(selector+' li.active a');
        var nownumber = parseInt($actel.html(),10);
        if(nownumber == 1){
            return false;
        }else{
            pagination.gopage(selector,nownumber-1);
        }
    },
    //向下翻页
    pagedown : function(){
        var $a = $(this).find('a');
        var selector = $a.attr('selector'),
            className = $a.parent().attr('class');
        if(className.indexOf('disabled') > -1){
            return -1;
        }
        var _tempInstance = pagination._map[selector];
        var pagenumber = _tempInstance.pagenumber;
        //获得该实例的分页码数
        var  $actel = $(selector+' li.active a');
        var nownumber = parseInt($actel.html(),10);
        if(nownumber == pagenumber){
            return false;
        }else{
            //如果后面是nextpage,则进行nextpage
            if($actel.parent().next().children().attr('class') == 'next'){
                //触发翻页事件
                $(selector+' a.next').trigger('click');
                //转移样式
                if($(selector+' li.active').length==0){
                    //在第一个增加样式
                    $(selector+' a.previous').parent().next().addClass('active').removeClass('unselect');           
                }else{
                    $actel.parent().addClass('unselect').removeClass('active');
                    $actel.parent().next().addClass('active').removeClass('unselect');
                }
            }else{
                if(nownumber == undefined || isNaN(nownumber)){
                    $(selector+' .unselect:first').addClass('active').removeClass('unselect');
                }else{
                    $actel.parent().addClass('unselect').removeClass('active');
                    $actel.parent().next().addClass('active').removeClass('unselect');
                }
            }
            var gonumber = parseInt($(selector+' li.active a').html(),10);
            pagination.gopage(selector,gonumber);
        }
    },
    //前面页面
    previouspage : function(){
        var selector = $(this).attr('selector');
        var _tempInstance =pagination._map[selector];
        var increment = _tempInstance.increment,
            page = _tempInstance.page;
        //判断当前是第几个，比如16，那么就以10的倍数向前翻页
        var $nowobj = $(selector+' a.previous').parent();
        var nextnumber = parseInt($nowobj.next().children().html(),10);
        var end = (nextnumber-1)%increment > 0 ? parseInt((nextnumber/increment),10)*increment : parseInt((nextnumber/increment-1),10)*increment;
        pagination.gopage(selector, end+1);
    },
    //后面页面
    nextpage : function(){
        //判断当前点击的哪些，比如：现在是5，点击生成6...
        var selector = $(this).attr('selector');
        var _tempInstance = pagination._map[selector];
        var increment = _tempInstance.increment;
        var $nowobj = $(selector+' a.next').parent();
        var prenumber = parseInt($nowobj.prev().children().html(),10);
        if(parseInt(prenumber/5,10) ==1){//说明在第一页，要从5加载5个，直到结束
            pagination.addPage(selector,$nowobj,5);
        }else{
            //第二次 增加页面数量了，应该是从10开始了...
            pagination.addPage(selector,$nowobj,increment);
        }
    },
    addPage : function(selector,domobj,size){
        var _tempInstance = pagination._map[selector];
        var pagenumber = _tempInstance.pagenumber,
            increment  = _tempInstance.increment;
        
        var start  = parseInt(domobj.prev().children().html(),10);
        pagination.gopage(selector, start+1);
    },
    loadPage : function(selector){
        //根据selector获得count,pagesize,page
        var _tempInstance = pagination._map[selector];
        var count = _tempInstance.count,
            pagesize = _tempInstance.pagesize,
            page = _tempInstance.page,
            increment = _tempInstance.increment,
            pageArrayStr = pagination.pageArrayStr(selector,pagesize),
            pagenumber = _tempInstance.pagenumber;
        var $page = $(selector);
        //清空内容
        $page.html('');
        var pageno = pagenumber;
        page = page > pageno ? 1 : page;    //如果当前页码树大于总页码数则置为1，否则为当前页码数；
        
        //如果页数超过10，则增...,以5个数字递增，
        //显示到page页面的下一个5的倍数上。
        var endpage = (parseInt(page/increment,10))*increment > pageno ? pageno : (parseInt(page/increment,10)+(page%increment==0 ? 0 : 1))*increment;
        if(pageno<=increment){
            endpage = pageno;
        }
        endpage = endpage === 0 ? 1 : endpage;
        pageno = pageno === 0 ? 1 : pageno;
        $page.append(pageArrayStr == '' ? '' : '<li class="pageinfo">共'+count+'条 , 每页'+pageArrayStr+'条</li>');
        $page.append('<li class="prev pageup '+(page ==1 ? 'disabled' : '')+'"><a title="'+pagination.previousTitle+'" href="javascript:;" selector="'+(selector)+'">'+pagination.previousContent+'</a></li>');
        //判断第几页
        var start = 0;
        if(page > increment && page <= pageno){
            $page.append('<li><a class="previous" href="javascript:;" selector="'+(selector)+'">...</a></li>');
            //给一个自定义增长数量，比如5个，每次增长五个，当前页面6页面，增长5个为10个，start page为 6
            start = parseInt((page%increment==0 ? (page-1) : page)/increment,10)*increment;
            endpage = (start+increment ) > pageno ? pageno : (start+increment);//如果开始页面加上增加页面大于最大页码数，则等于最大页码数
            if(endpage-page <increment){
                start = endpage-increment;
            }
        }
        for(var i=start;i<endpage;i++){
            var listr = '<li class="unselect"><a href="javascript:;" selector="'+(selector)+'">'+(i+1)+'</a></li>';
            //在第page页面增加样式
            if((page-1) == i){
                listr = '<li class="active"><a selector="'+(selector)+'">'+(i+1)+'</a></li>';
            }
            $page.append(listr);
        }
        if(pageno > 5 && endpage != pageno){
            $page.append('<li><a class="next" href="javascript:;" selector="'+(selector)+'">...</a></li>');
        }
        $page.append('<li class="next pagedown '+(page == pageno ? 'disabled' : '')+'"><a title="'+pagination.nextTitle+'" href="javascript:;" selector="'+(selector)+'">'+pagination.nextContent+'</a></li>');
    },
    //跳转页面
    gopage : function(selector,page){
        var _tempInstance = pagination._map[selector];
        _tempInstance.page = page;
        _tempInstance.action = true;
        _callback = _tempInstance.callback;
        _pagesize = _tempInstance.pagesize;
        pagination._map[selector] = _tempInstance;
        _callback(pagination.transform({
            page : page,
            rows : _pagesize
        }));
    },
    /*返回现在的页面*/
    getNowPage : function(selector){
        selector = selector || pagination.lastSelector;//获取上一个选择器
        var _tempInstance = pagination._map[selector];
        _tempInstance.action = true;
        var _page = _tempInstance.page,
            _pagesize = _tempInstance.pagesize;
        pagination._map[selector] = _tempInstance;
        
        return pagination.transform({
            page : _page,
            rows : _pagesize
        });
    },
    transform : function(paginationParams){
        if(pagination.isTransform && pagination.isTransform == true){
            var p = paginationParams.page || 1;
            var rows = paginationParams.pagesize || 10;
            return {
                begin : (p-1)*rows+1,
                end : p*rows
            };
        }
        return paginationParams;
    },
    //返回分页参数，以供列表页面加载数据使用
    getParams :function(selector){
        selector = selector || pagination.lastSelector;//获取上一个选择器
        var _tempInstance = pagination._map[selector];
        var _pagesize = _tempInstance.pagesize;
        return pagination.transform({
            //第几页，一页有多少条记录
            page:1,
            rows : _pagesize
        });
    },
    changePagesize : function(ev){
        var t = ev.currentTarget || ev.target || ev.srcElement;$t = $(t),v=$t.find('option:selected').val(),selector = $t.attr('selector');
        var _tempInstance = pagination._map[selector];
        _tempInstance.pagesize = v;
        var _callback = _tempInstance.callback;
        pagination._map[selector] = _tempInstance;
        //重新调用callback方法
        _callback(pagination.transform({
            page : 1,
            rows : v
        }));
    }
};
