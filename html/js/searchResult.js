//页面加载成功初始化数据
Zepto(function ($) {

    //是一个简单，易于使用的js库用于消除在移动浏览器上触发click事件与一个物理Tap(敲击)之间的300延迟。
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function(){
            FastClick.attach(document.body);
        }, false);
    }

    //初始化访问接口url
    var URL = 'http://180.111.125.79:8084';

    //动态获取url后面的参数
    function getUrlParam(k) {
        var regExp = new RegExp('([?]|&)' + k + '=([^&]*)(&|$)');
        var result = window.location.href.match(regExp);
        if (result) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }

    var GOODSNAME = getUrlParam('goodsName');

    $('input.to-search').val(GOODSNAME);

    //获取首屏数据
    //页数
    var pageIndex = 1;
    var maxIndex = null;

    fenYe(GOODSNAME,pageIndex);

    //滚动加载数据
    var range = 400; //距下边界长度/单位px
    var huadong = true;
    var totalheight = 0;

    $(window).scroll(function () {

        console.log(maxIndex);
        console.log(pageIndex);
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)

        if ( pageIndex >= ( maxIndex -1) ) {

            return false;
        }

        totalheight = parseFloat($(window).height()) + parseFloat(srollPos); //滚动条当前位置距顶部距离+浏览器的高度

        if (($(document).height() == totalheight)) {

            pageIndex++;

            fenYe(GOODSNAME,pageIndex);

        } else {
            if (($(document).height() - totalheight) <= range) { //页面底部与滚动条底部的距离<range

                if (huadong) {
                    huadong = false;
                    pageIndex++;
                    fenYe(GOODSNAME,pageIndex);
                }
            } else {

                huadong = true;
            }
        }
    });

    //加载请求数据
    function fenYe(goodsname,pageindex) {
        $.ajax({
            type: 'post',
            url: URL + '/h5/h5search/searchList',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {
                goodName: goodsname,
                index: pageindex,
                size: 10
            },
            success:function (data) {
                console.log(data);
                var dataEncode = data.data;
                maxIndex = data.data.maxIndex;
                var pagefn = doT.template($('#SearchResultInit-tpl').text(), undefined);
                showListAppend('#SearchResultInit', dataEncode, pagefn, true);
                if( pageindex == (maxIndex - 1) ){
                    popBox('您搜索的商品已经显示完毕');
                }
                $(".goods-show").on("tap",".goods-item",function () {
                    window.location.href = "goodDetail.html?goodId=" + $(this).attr("data-goodid");
                })
            },
            error:function(){
                popBox("服务器错误");
            }
        })
    }

    //点击搜索
    $('.searchCancel').click(function () {

        //滚动条为0;
        $(window).scrollTop(0);

        GOODSNAME = $('input.to-search').val();

        if(GOODSNAME == ""){
            popBox('请在搜索栏目输入您想搜索的商品名称');
        }

        //历史搜索记录
        //判断是否已经有历史几率
        if(localStorage.getItem('name')){
            localStorage.name = localStorage.getItem('name') + ',' + GOODSNAME;
        }
        else {
            localStorage.name = GOODSNAME;
        }

        pageIndex = 1;

        $.ajax({
            type: 'post',
            url: URL + '/h5/h5search/searchList',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {
                goodName: GOODSNAME,
                index: pageIndex,
                size: 10
            },
            success:function (data) {
                $('#SearchResultInit').html('');
                var dataEncode = data.data;
                maxIndex = data.data.maxIndex;
                var pagefn = doT.template($('#SearchResultInit-tpl').text(), undefined);
                showListAppend('#SearchResultInit', dataEncode, pagefn, true);
            },
            error:function(){
                popBox("服务器错误");
            }
        })
    });

    //点击返回
    $('.back').click(function () {
        history.go(-1);
    });

    //        添加内容的方法
    function showListAppend(el, data, callback, type) {
        /* console.log(data); */
        if (type) {
            $(el).append(callback(data));
        } else {
            console.log('禁止渲染');
            /* ? */
        }
    }


    // 弹窗 ，2秒后消失
    function popBox(msg) {

        $('body').append(
            '<div class="hintPopBox" style="z-index: 999">\
            <div class="hintPop">' + msg + '</div>\
                </div>'
        );
        setTimeout(removePopBox, 2000);
        function removePopBox() {
            $('.hintPopBox').remove();
        }
    }

});