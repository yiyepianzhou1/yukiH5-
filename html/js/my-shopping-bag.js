Zepto(function ($) {
    $(".header-nav-buy-bag").on("touchend",".left-nav-icon",function(){
        window.history.go(-1);
    });
    //是一个简单，易于使用的js库用于消除在移动浏览器上触发click事件与一个物理Tap(敲击)之间的300延迟。
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function(){
            FastClick.attach(document.body);
        }, false);
    }
    //初始化访问接口url
    var URL = 'http://180.111.125.79:8084';
    //初始化 用户的userId
    var USERID = window.localStorage.uid;

    //初始化skuList对象
    var SKULIST = [];

    //  页面初始化请求数据
    $.ajax({
        type: 'post',
        url: URL + '/h5/h5goodcart/findUserGoodCart',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        data: {
            userid: USERID
        },
        success: function (data) {

            if (data.data.state == 'success') {
                var dataEncode = data.data;
                var interText = doT.template($("#goods-shopping-tpl").html());
                $("#goods-shopping").html(interText(dataEncode));
                //  渲染页面初始化事件
                init();
            }
        }
        ,
        error: function (error) {
            popBox('服务器错误');
        }
    });


    function max(data) {
        return data
    }


    //初始化动作
    function init() {

        //   点击编辑button
        $('.cancel').click(function () {
            //页面初始化
            $('.selectIcon').removeClass('active');
            $('.selectedIcon').removeClass('active');

            // 计算总价
            compute();

            if ($(this).hasClass('to-edit')) {
                $(this).html('完成');
                $(this).removeClass('to-edit');
                $('.orderListChild-info').addClass('edit-status');
                $('.number').hide();
                $('.buy').hide();
                $('.totalPrice').hide();
                $('.delete').show();
                $('.myOrder-goodStyle').addClass('style-false');
            }
            else {
                $(this).html('编辑');
                $(this).addClass('to-edit');
                $('.orderListChild-info').removeClass('edit-status');
                $('.number').show();
                $('.buy').show();
                $('.totalPrice').show();
                $('.delete').hide();
                $('.myOrder-goodStyle').removeClass('style-false');
            }
        });

        //   进入商品详情页
        $('.goods-item').click(function () {
            var GOODSID = $(this).attr('data-goodsid');
            //跳到商品详情页
            window.location.href = 'goodDetail.html?goodId=' + GOODSID;
        });
        //   进入商品详情页
        $('.myOrder-goodImg, .myOrder-goodName').click(function () {
            var GOODSID = $(this).parents('.orderListChild-info').attr('data-goodsid');
            //跳到商品详情页
            window.location.href = 'goodDetail.html?goodId=' + GOODSID;
        });

        //  单个选中商品
        $('.selectIcon').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.delete').removeClass('active');
                if ($('.cancel').hasClass('to-edit')) {
                    compute();
                }
                // 判断是否全部被选中
                selectTotal();
            }
            else {
                $(this).addClass('active');
                $('.delete').addClass('active');
                if ($('.cancel').hasClass('to-edit')) {
                    compute();
                }
                // 判断是否全部被选中
                selectTotal();
            }
        });

        //  全部选中商品
        $('.selectedIcon').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.delete').removeClass('active');
                $('.selectIcon').removeClass('active');
//                    计算总价
                compute();
            }
            else {
                $(this).addClass('active');
                $('.delete').addClass('active');
                $('.selectIcon').addClass('active');
                // 计算总价
                compute();
            }

        });

        // 数量增加
        $('.button-right').click(function () {

            //                判断商品数量是否为0
            if ($(this).parents('.orderListChild-info').hasClass('false')) {
                return false;
            }

            var $input = $(this).parents('.pedding-buy-count').find('.count-input input');
            var SKUID = $(this).parents('.orderListChild-info ').attr('data-skuid');
            var CARTID = $(this).parents('.orderListChild-info ').attr('data-cartid');
            var SKUSTOCK = $(this).parents('.orderListChild-info ').attr('data-skustock');
            var NUMBER = $input.val();

            if (parseFloat(SKUSTOCK) <= parseFloat(NUMBER)) {
                //弹出窗  2s消失
                popBox("购买商品数量不能大于库存");
            }

            NUMBER = parseFloat(NUMBER) + 1;

            $.ajax({
                type: 'post',
                url: URL + '/h5/h5goodcart/updateUserGoodCart',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                data: {
                    userid: USERID,
                    cartid: CARTID,
                    type: 'plus',
                    skuid: SKUID,
                    count: NUMBER
                }
                ,
                success: function (data) {

                    if (data.state == 'success') {
                        $input.val(NUMBER);
                        $('.myOrder-goods-count').html(NUMBER);
                        //弹出窗  2s消失
                        popBox('修改成功');
                    }
                }
                ,
                error: function (error) {
                    alert(error);
                }
            });
        });

        // 数量减少
        $('.button-left').click(function () {

            //判断商品数量是否为0
            if ($(this).parents('.orderListChild-info').hasClass('false')) {
                return false;
            }

            var $input = $(this).parents('.pedding-buy-count').find('.count-input input');
            var SKUID = $(this).parents('.orderListChild-info ').attr('data-skuid');
            var CARTID = $(this).parents('.orderListChild-info ').attr('data-cartid');
            var NUMBER = $input.val();

            if (parseFloat(NUMBER) == 1) {

                popBox('商品数量不能小于1');
                return false
            }
            NUMBER = parseFloat(NUMBER) - 1;

            $.ajax({
                type: 'post',
                url: URL + '/h5/h5goodcart/updateUserGoodCart',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                data: {
                    userid: USERID,
                    cartid: CARTID,
                    type: 'less',
                    skuid: SKUID,
                    count: NUMBER
                },
                success: function (data) {

                    if (data.state == 'success') {
                        $input.val(NUMBER);
                        $('.myOrder-goods-count').html(NUMBER);
                        //弹出窗  2s消失
                        popBox('修改成功');
                    }
                }
                ,
                error: function (error) {
                    alert(error);
                }
            });
        });


        // 删除购物车类的商品
        $('.delete').click(function () {

            if (!$(this).hasClass('active')) {
                return false;
            }

            var CARTID = '';

            $('.orderListChild-info').each(function (item, index) {
                if ($(this).find('.selectIcon').hasClass('active')) {
                    CARTID = CARTID + $(this).attr('data-cartid') + ',';
                }
            });


            $.ajax({
                type: 'post',
                url: URL + '/h5/h5goodcart/delUserGoodCart',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                data: {
                    userid: USERID,
                    cartids: CARTID
                }
                ,
                success: function (data) {

                    if (data.state == 'success') {
                        //删除成功
                        $('.orderListChild-info').each(function (index, item) {
                            if ($(this).find('.selectIcon').hasClass('active')) {
                                //   商品移除购物车列表
                                $(this).remove();
                            }
                        });

                        //删除成功页面初始化
                        $('.delete').removeClass('active');
                        $('.selectedIcon').removeClass('active');

                        //弹出窗  2s消失
                        popBox('删除成功');
                    }
                }
                ,
                error: function () {
                    //  alert('error');
                }
            })

        });

        //点击规格
        $('.myOrder-goodStyle').click(function () {
            if (!$(this).hasClass('style-false')) {
                return false;
            }

            var GOODSID = $(this).parents('.orderListChild-info').attr('data-goodsid');
            var SKUID = $(this).parents('.orderListChild-info').attr('data-skuid');
            var NOWNUMBER = $(this).parents('.orderListChild-info').find('.count-input input').val();
            var CARTID = $(this).parents('.orderListChild-info').attr('data-cartid');
            $.ajax({
                type: 'post',
                url:  URL + '/h5/h5good/findGoodDetail',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                data: {
                    userid: '95',
                    goodid: GOODSID,
                    sortText: 'asc'
                },
                success: function (data) {

                    if (data.data.state == 'success') {
                        var dataEncode = data.data;
                        var interText = doT.template($("#shopping-car-tpl").html());
                        $("#shopping-car").html(interText(dataEncode));

                        SKULIST = data.data.goodDetailBean.skuList;

                        //初始化选中的商品和数量
                        AgoNumber = NOWNUMBER;
                        cartId = CARTID;


                        //是底层不滚动
                        $('body').addClass('bjc');

                        //初始化选择规格
                        skuSelect(SKUID,SKULIST,NOWNUMBER,CARTID);

                        //事件初始化
                        initAgin();

                    }
                }
                ,
                error: function (error) {
                    popBox("服务器错误");
                }
            });

            $('.shopping-car').show();
            $('.shopping-car').addClass('show');
            $('.cover-decision').show();
        });

        function initAgin() {

            //隐藏弹出窗
            $('.cover-decision, .popupBox-closeBtn').click(function () {
                $('body').removeClass('bjc');
                $('.cover-decision').hide();
                $('.shopping-car').removeClass('show');
                setTimeout(function () {
                    $('.shopping-car').hide();
                }, 200)
            });

            //选择规格来改变加个
            $('.pedding-select .text-content').click(function () {

                //获取之前被选中规格的valueid
                var AOGVALUEID = $(this).parents("div.pedding-select").find('.active').attr('data-valueid') + '';
                //获取skutext
                var SKUTIDEXT = $('#shopping-car').attr('data-skuidtext') + '';

                //现有规格商品的数量来判断用户是增加了商品数量还是减少了商品数量
                AGONUMBER = $('#shopping-car').find('.count-input input').val();
                $(this).parents("div.pedding-select").find(".text-content").each(function (index, item) {
                    $(item).removeClass("active");
                });
                $(this).addClass("active");

                var VALUEID = $(this).attr('data-valueid') + '';
                var NEWSKUIDTEXT =SKUTIDEXT.replace(AOGVALUEID,VALUEID);

                skuidText(NEWSKUIDTEXT,SKULIST,AGONUMBER);
            });

            //弹窗点击数量
            $('.shopping-car .button-left').click(function () {


                var NUMBER = $(this).parents('.pedding-buy-count').find('input').val();

                var STORED = parseFloat($('.store-count').html());

                if(STORED == 0){
                    popBox('没有库存');
                    return false;
                }

                if(parseFloat(NUMBER) == 1){
                    popBox('商品数量不能小于1');
                    return false;
                }

                //减少数量
                NUMBER = parseFloat(NUMBER) - 1;
                $(this).parents('.pedding-buy-count').find('input').val(NUMBER);

            });

            $('.shopping-car .button-right').click(function () {
                var NUMBER = $(this).parents('.pedding-buy-count').find('input').val();

                var STORED = parseFloat($('.store-count').html());

                if(STORED == 0){
                    popBox('没有库存');
                    return false;
                }

                if(parseFloat(NUMBER) == STORED){
                    console.log(2);
                    popBox('购买商品数量不能大于库存');
                    return false;
                }

                //增加数量
                NUMBER = parseFloat(NUMBER) + 1;
                console.log(NUMBER);
                $(this).parents('.pedding-buy-count').find('input').val(NUMBER);

            });

            //点击完成
            $('.popupBox-ensureBtn').click(function () {

                //判断用户是增加还是减少商品数量
                var TYPE = '';

                //skuid
                var SKUID = $('#shopping-car').attr('data-skuid');
                //数量number
                var NOWNUMBER = $('#shopping-car .count-input input').val();
                var AgoNumber = $('#shopping-car').attr('data-agonumber');
                var CARTID = $('#shopping-car').attr('data-cartid');

                //库存
                var STORED = parseFloat($('.store-count').html());
                if(STORED == 0){
                    popBox('没有库存');
                    return false;
                }

                console.log(AgoNumber);
                if( parseFloat(AgoNumber) > parseFloat(NOWNUMBER) ){
                    TYPE ='less';
                }
                else if(parseFloat(AgoNumber) < parseFloat(NOWNUMBER)){
                    TYPE ='plus';
                }
                else {
                    TYPE = null;
                }

                console.log(TYPE);

                $.ajax({
                    type: 'post',
                    url:  URL + '/h5/h5goodcart/updateUserGoodCart',
                    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                    data: {
                        cartid: CARTID,
                        type: TYPE,
                        userid: USERID,
                        skuid: SKUID,
                        count: NOWNUMBER
                    },
                    success: function (data) {

                        if (data.state == 'success') {
                            //弹出窗  2s消失
                            popBox('修改成功');

                            //1s后刷新页面
                            setTimeout(function () {
                                window.location.reload();
                            },1000)
                        }
                    }
                    ,
                    error: function (error) {
                        alert(error);
                    }
                })

            })

        }

        //点击结算
        $('.buy').click(function () {
            //定义skuid 字符串
            var SKUIDLIST = '';
            //未选择地址传0
            var ADDRID = window.localStorage.uid;
            //遍历被选中的商品
            $('.orderListChild-info').each(function (item, index) {
                if($(this).find('.selectIcon').hasClass('active')){
                    var SKUID = $(this).attr('data-skuid');
                    SKUIDLIST = SKUIDLIST + SKUID +',';
                }
            });
            console.log(SKUIDLIST);
            console.log(USERID);
            console.log(ADDRID);
            //给订单传值
            window.localStorage.skuid = SKUIDLIST;
            window.localStorage.addrId = ADDRID;
            window.location.href = "checkOrder.html?isFromBag=true";
        })
    }

    // 初始化根据skuid来选中被选中的规格
    function skuSelect(skuid,skulist,nownumber,cartid) {

        skuList(skuid,skulist,nownumber,cartid);

    }

    // 遍历skulist
    function skuList(skuid,skulist,nownumber,cartid) {
        var  skuidText ="";
        skulist.map(function (item,index) {
            if(parseFloat(item.skuid) == parseFloat(skuid)){
                skuidText = item.skuidText;
                $('#shopping-car').find('.goods-picture img').attr('src',item.skuPic);
                $('#shopping-car').attr('data-skuidtext',skuidText);
                $('#shopping-car').attr('data-skuid',item.skuid);
                $('.price').html('￥'+ parseFloat(item.nowPrice)/100);
                $('.selected-type').html(item.skuDesc);
                $('#shopping-car').find('.count-input input').val(nownumber);
                $('#shopping-car').attr('data-agonumber',nownumber);
                $('#shopping-car').attr('data-cartid',cartid);
                $('.stored').html('库存: (<em class="store-count">' + item.stockNum + '</em>)');
                ruler(skuidText);
            }
        });
    }

    //根据skuText来匹配skuid
    function skuidText(skuidtext,skulist) {
        console.log(skuidtext);
        skulist.map(function (item,index) {
            if(item.skuidText == skuidtext){
                console.log(item.skuidText);
                $('#shopping-car').attr('data-skuidtext',item.skuidText);
                $('#shopping-car').attr('data-skuid',item.skuid);
                $('#shopping-car').find('.goods-picture img').attr('src',item.skuPic);
                $('.price').html('￥'+ parseFloat(item.nowPrice)/100);
                $('.selected-type').html(item.skuDesc);
                $('#shopping-car .count-input input').val('1');
                $('.stored').html('库存: (<em class="store-count">' + item.stockNum + '</em>)');
            }
        });
    }

    //遍历规格选中
    function ruler(skuidText) {

        $('.goodDetailBean-item').each(function (index,items) {
            var $self = $(this);
            $self.find('.text-content').map(function (index,item) {
                var VALUEID = $self.find('.text-content').eq(index).attr('data-valueid');
                if(skuidText.indexOf(VALUEID) > 0){
                    $self.find('.text-content').eq(index).addClass('active');
                }
            });
        })
    }

    //单个商品被选来判断全选是否被选中
    function selectTotal() {
        $('.orderListChild-info').each(function (item, index) {
            if (!$(this).find('.selectIcon').hasClass('active')) {
                $('.selectedIcon').removeClass('active');
                return false;
            }
            else {
                $('.selectedIcon').addClass('active');
            }
        })
    }

    // 计算商品总价
    function compute() {
        var totolPrice = 0;

        $('.orderListChild-info').each(function (item, index) {
            if ($(this).find('.selectIcon').hasClass('active')) {
                var singlePrice = parseFloat($(this).find('.myOrder-single-price').html()) * parseFloat($(this).find('.myOrder-goods-count').html());
                totolPrice = parseFloat(totolPrice) + parseFloat(singlePrice);
            }
            else {
                if ($(this).find('.selectIcon').hasClass('active')) {
                    var singlePrice = parseFloat($(this).find('.myOrder-single-price').html()) * parseFloat($(this).find('.myOrder-goods-count').html());
                    totolPrice = parseFloat(totolPrice) - parseFloat(singlePrice);
                }
            }

        });

        $('.total-number').html(totolPrice);

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