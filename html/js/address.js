/**
 * Created by Administrator on 2017/8/11 0011.
 */
/*
Zepto(function ($) {
    
});*/
$(function () {
    var url = location.href;
    var isDefault = 0;
    //判断地址栏是否有参数
    var isEditAddress = null;
    (function () {
        if(url.indexOf("?addrId") > -1){
            return isEditAddress= true;
        }else{
            return isEditAddress=false;
        }
    })();
    console.log(isEditAddress);
    //如果有参数渲染数据
    if(isEditAddress){
        $(".recommend").text("编辑收货地址");
        $(".address-delete").text("删除").addClass("deleteBtn");
        //渲染数据
        var addrssId = url.split("=")[1];
        console.log(addrssId);
        $.ajax({
            type:"post",
            url:"http://192.168.0.178:8084/h5/h5address/getAddressById",
            dataType:"json",
            data:{
                adrid:addrssId
            },success:function (date) {
                var ajax_data = date.data;
                console.log(ajax_data);
                console.log(ajax_data.address.name);
                $(".address-name").val(ajax_data.address.name);
                $(".address-number").val(ajax_data.address.phone);
                $(".address-position").val(ajax_data.address.province+' '+ajax_data.address.city+' '+ajax_data.address.area);
                $(".addressDetail").val(ajax_data.address.addressDetail);
                //设置默认地址按钮
                isDefault = ajax_data.address.isAvalible;
                setDefaultBtn(isDefault);
            }
        });
        //监听默认地址按钮
        setDefaultBtn(isDefault);
        $(".address-setDefault").on("touchend",".moren-btn ",function () {
            setDefaultBtn(isDefault);
        });
        //删除地址按钮监听
        $(".deleteBtn").on("touchend",function () {
            $.ajax({
                type:"post",
                url:"http://192.168.0.178:8084/h5/h5address/deletUserAddress",
                data:{
                    adrid:addrssId
                },success:function (date) {
                    console.log(date);
                    popBox(date.data.state);
                    history.go(-1);
                }
            })
        })
    }else{
        $(".recommend").text("新增收货地址");
        $(".address-delete").text("取消").addClass("cancelBtn");
        //监听默认地址按钮
        setDefaultBtn(isDefault);
        $(".address-setDefault").on("touchend",".moren-btn ",function () {
            setDefaultBtn(isDefault);
        });
        //监听取消按钮
        $(".cancelBtn").on("touchend",function () {
            history.go(-1);
        })
    }
    //点击地址选择
    $(".address-position").on("touchend",function(){
        $(".select-address").show();
    });
    //点击确认
    $(".addressbtn").on("touchend",".surebtn",function(){
        var text = "";
        $("select").each(function(){
            text += $(this).val()+" ";
        });
        $(".address-position").val(text);
        $(".select-address").hide();
    });
    //点击取消
    $(".addressbtn").on("touchend",".notbtn",function(){
        $(".select-address").hide();
    });
    //默认地址
    $("#distpicker").distpicker({
        province:"北京市",
        city:"北京市市辖区",
        district:"东城区"
    });
    // 自定义添加avalidate.js中的规则
    ac.addRule({
        tm: /^1(3|4|5|7|8)\d{9}$/i
    });
    // 对，就这么简单就初始化了。
    ac.form({
        area: '.address', // 验证区域，支持标签，id，class，推荐使用id或者class
        btn: '.button-addNewAddress', // 触发验证的按钮或者元素，支持标签，id，class，推荐使用id或者class
        singleError: function (e, msg) {
            popBox(msg);
        },
        endSuccess: function () {
            // 验证成功提交请求
            if(isEditAddress){
                editAddress();
            }else{
                addAddress();
            }
        }
    });
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
    //按钮位置
    function setDefaultBtn(state) {
        console.log(state);
        if(state == 1){
            //右边
            $(".ball").animate({left:".42rem"},300);
            $(".moren-btn").css({"background":"#20A4E9"});
            return isDefault = 0;
        }else{
            //左边
            $(".ball").animate({left:".04rem"},300);
            $(".moren-btn").css({"background":"#A5A39D"});
            return isDefault = 1;
        }
    }
    //修改地址
    function editAddress() {
        console.log(isDefault);
        var postion = $(".address-position").val().split(" ");
        $.ajax({
            type:"post",
            url:"http://192.168.0.178:8084/h5/h5address/editUserAddress",
            dataType:"json",
            data:{
                adrName:$(".address-name").val(),
                adrid:addrssId,
                adrPhone:$(".address-number").val(),
                adrProvince:postion[0],
                adrCity:postion[1],
                adrDistrict:postion[2],
                adrDetail:$(".addressDetail").val(),
                isAvalible:isDefault
            },success:function (date) {
                if(date.data.state == "success"){
                    console.log(date);
                    history.go(-1);
                }else{
                    popBox(date.data.errMsg);
                }
            },error:function () {
                popBox("网络错误");
            }
        })
    }
    //新建地址
    function addAddress() {
        var postion = $(".address-position").val().split(" ");
        //window.localStorage.uid
        $.ajax({
            type:"post",
            url:"http://192.168.0.178:8084/h5/h5address/addUserAddress",
            dataType:"json",
            data:{
                userid:window.localStorage.uid,
                adrName:$(".address-name").val(),
                adrPhone:$(".address-number").val(),
                adrProvince:postion[0],
                adrCity:postion[1],
                adrDistrict:postion[2],
                adrDetail:$(".addressDetail").val(),
                isAvalible:isDefault
            },success:function (date) {
                console.log(date);
                if(date.data.state){
                    popBox("新增地址成功");
                    history.go(-1);
                }
            }
        })
    }
    $(".header-nav-recommend").on("touchend",".nav-icon",function(){
        window.history.go(-1);
    });
});