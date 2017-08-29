/**
 * Created by Administrator on 2017/8/4 0004.
 */
Zepto(function ($) {
    var userId = window.localStorage.uid;
    // 首页渲染函数
    function randerIndex() {
        var ajax_data = null;
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5index/indexPage',
            dataType: 'json',
            success: function (date) {
                if (date.data.state == 'success') {
                    ajax_data = date.data;
                    console.log(ajax_data);
                    rabderIndexData(ajax_data);
                    newBanner();
                    $(".goods-item").on("tap",function () {
                        window.location.href = "goodDetail.html?goodId="+$(this).attr("data-goodid");
                    });
                    $(".poplar-goods-show").on("tap",function () {
                        window.location.href = "goodDetail.html?goodId="+$(this).attr("data-goodid");
                    });
                    $(".banners").find(".islider-outer").on("tap",".islider-html",function () {
                        window.location.href = "goodDetail.html?goodId="+$(this).find(".iSlider-img").attr("data-goodid");
                    });
                    $(".header-nav-recommend-icon-right").on("tap",function () {
                        window.location.href = "indexType.html?isNew="+$(this).attr("data-isNew");
                    })
                }
            },
            error: function () {
                popBox('网络错误');
            }
        });
        // 轮播
        function newBanner() {
            var list1 = [];
            for (var i = 0; i < ajax_data.banners.length; i++) {
                list1.push({ content: '<img src="' + ajax_data.banners[i].picUrl + '" data-goodId="' + ajax_data.banners[i].targetId + '" alt="" class="iSlider-img">' });
            }
            islider = new iSlider({
                data: list1,
                dom: document.getElementById('iSlider-wrapper'),
                isAutoplay: 1,
                isLooping: 1,
                isOverspread: 1,
                animateTime: 800
            });
        }

        // 渲染数据
        function rabderIndexData(obj) {
            var pagefn = doT.template($('#popularGoodBeanList-tpl').text(), undefined);
            var pagefn2 = doT.template($('#newGoodBeanList-tpl').text(), undefined);
           /* var pagefn3 = doT.template($('#banners-tpl').text(), undefined);*/
            var pagefn4 = doT.template($('#guessGoodList-tpl').text(), undefined);
            // var pagefn5 = doT.template($('#typeBeanList-tpl').text(), undefined);
            //    人气推荐
            showListAppend('#popularGoodBeanList', obj, pagefn, true);
            // 新品推荐
            showListAppend('#newGoodBeanList', obj, pagefn2, true);
            // banner
            /*showListAppend('#banners', obj, pagefn3, true);*/
            // 猜你喜欢
            showListAppend('#guessGoodList', obj, pagefn4, true);
        }
    }
    randerIndex();
    //        添加内容的方法
    function showListAppend(el, data, callback, type) {
        /* console.log(data); */
        if (type) {
        	console.log(JSON.stringify(callback(data)));
            $(el).append(callback(data));
        } else {
            console.log('禁止渲染');
            /* ? */
        }
    }

    //        覆盖内容的方法
    function showListOverride(el, data, callback, type) {
        if (type) {
            console.log(JSON.stringify(callback(data)));
            $(el).html(callback(data));
        } else {
            console.log('禁止渲染');
        }
    }

    // 类型分类
    // showListAppend($('#typeBeanList'), ajax_data.data, pagefn5,true);
    //        showListOverride($('#content'), obj, true);
    // 弹窗 ，2秒后消失
    function popBox(msg) {
        $('main').append(
            '<div class="hintPopBox">\
            <div class="hintPop">' + msg + '</div>\
                </div>'
        );
        setTimeout(removePopBox, 2000);
        function removePopBox() {
            $('.hintPopBox').remove();
        }
    }

    // 切换footer tab
    $('.footer-bar-item').on("touchend	",function () {
        $(this).find('.info').addClass('info-1-blue');
        $('.footer-bar-item').not(this).find('.info').removeClass('info-1-blue');
        var src = $(this).find('.icon').attr('src');
        var str = 'n@3x';
        var strBlue = 'p@3x';
        var srcBlue = src.replace(str, strBlue);
        $(this).find('.icon').attr('src', srcBlue);
        $('.footer-bar-item').not(this).find('.icon').each(function () {
            var otherSrc = $(this).attr('src');
            var srcDefalut = otherSrc.replace(strBlue, str);
            $(this).attr('src', srcDefalut);
        });
        console.log($(this).attr("data-src"));
        if($(this).attr("data-src") == "shoppingBag.html"){
            if( userId == undefined){
                window.localStorage.backUrl = location.href;
                window.location.href = "logIn.html";
            }else{
                window.location.href = $(this).attr("data-src");
            }
        }else{
            window.location.href = $(this).attr("data-src");
        }
    });
    $(".search").on("tap",".to-search",function () {
        window.location.href = "search.html";
    })
});
