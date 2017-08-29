
//页面初始化数据
Zepto(function ($) {

    //是一个简单，易于使用的js库用于消除在移动浏览器上触发click事件与一个物理Tap(敲击)之间的300延迟。
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function(){
            FastClick.attach(document.body);
        }, false);
    }

    //初始化访问接口url
    var URL = 'http://180.111.125.79:8084';

    //本地存储搜索历史数据进行解析
    if(localStorage.getItem('name')){
        var DATA = localStorage.getItem('name');
        var  HISTORY =  DATA.split(",");
        console.log(HISTORY);
        var HISTORYDATA = [];
        HISTORY.map(function (item,index) {
            var name = {};
            name.history = item ;
            HISTORYDATA[index] = name;
        });
    }
    else {
        var HISTORYDATA = [];
    }

    console.log(HISTORYDATA);

    var data = {
        name: HISTORYDATA
    };

    var dataEncode = data;
    var interText = doT.template($("#historySearch-tpl").html());
    $("#historySearch").html(interText(dataEncode));

    //首屏渲染数据
    $.ajax({
        type: 'post',
        url: URL + '/h5/h5search/findHotSearchLogList',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        data: {},
        success: function (data) {

            if (data.data.state == 'success') {
                var dataEncode = data.data;
                var interText = doT.template($("#searchList-tpl").html());
                $("#searchList").html(interText(dataEncode));
                //  渲染页面初始化事件
                init();
            }
        },
        error: function (error) {
            popBox('服务器错误');
        }
    });

    //初始化数据
    function init() {

        //点击进入搜索商品列表页
        $('.historySearch-row2-keywords').click(function () {

            //历史搜索记录
            //判断是否已经有历史几率
            GOODSNAME = $(this).html();
            if(localStorage.getItem('name')){
                localStorage.name = localStorage.getItem('name') + ',' + GOODSNAME;
            }
            else {
                localStorage.name = GOODSNAME;
            }

            window.location.href = 'searchResult.html?goodsName=' + GOODSNAME;

        });

        //搜索按钮
        $('.searchCancel').click(function () {
            //历史搜索记录
            //判断是否已经有历史几率
            GOODSNAME = $('input.to-search').val();
            if(localStorage.getItem('name')){

                localStorage.name = localStorage.getItem('name') + ',' + GOODSNAME;
            }
            else {
                localStorage.name = GOODSNAME;
            }

            var GOODSNAME = $('input.to-search').val();
            window.location.href = 'searchResult.html?goodsName=' + GOODSNAME;
        });

        //清楚历史记录
        $('.historySearch-row1-deleteBtn').click(function () {
            $('#historySearch').html('');
            //清楚所有历史记录
            localStorage.clear();
        })

    }


});