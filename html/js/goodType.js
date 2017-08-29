/**
 * Created by Administrator on 2017/8/15 0015.
 */
/**
 * Created by Administrator on 2017/8/4 0004.
 */
Zepto(function ($) {
    var userId = window.localStorage.uid;
    randerTypeList();
    // 分类页渲染函数
    function randerTypeList() {
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5goodtype/findOneLevelGoodType',
            dataType: 'json',
            asnyc:false,
            success: function (date) {
                console.log(date);
                var pagefn6 = doT.template($('#head-search-tpl').text(), undefined);
                var pagefn7 = doT.template($('#typeListOne-tpl').text(), undefined);
                showListAppend('#head-search', "", pagefn6, true);
                showListAppend('#typeListPage', date.data, pagefn7, true);
                $(".search").on("tap",".to-search",function () {
                    window.location.href = "search.html";
                });
            }
        });
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5goodtype/findTwoLevelGoodType',
            asnyc:false,
            data: {
                typeid: 1
            },
            dataType: 'json',
            success: function (date) {
                var pagefn8 = doT.template($('#typeListTwo-tpl').text(), undefined);
                showListAppend('#typeListTwo', date.data, pagefn8, true);
                $(".goods-row").on("tap",".goods-item-1",function () {
                    window.location.href = "goodList.html?typeTwoId="+$(this).attr("data-typeid");
                });
            }
        });
    }
    //渲染二级分类
    function randerTypeListTwo(n) {
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5goodtype/findTwoLevelGoodType',
            asnyc:false,
            data: {
                typeid: n
            },
            dataType: 'json',
            success: function (date) {
                var pagefn8 = doT.template($('#typeListTwo-tpl').text(), undefined);
                showListOverride('#typeListTwo', date.data, pagefn8, true);
                $(".goods-row").on("tap",".goods-item-1",function () {
                    window.location.href = "goodList.html?typeTwoId="+$(this).attr("data-typeid");
                });
            }
        });
    }
    $(document).on("touchend",".classification-name",function () {
        var typeId = $(this).attr("data-typeid");
        console.log(typeId);
        window.localStorage.typeOneId = typeId;
        randerTypeListTwo(typeId);
    });
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
});
