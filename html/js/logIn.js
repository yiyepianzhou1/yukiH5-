/**
 * Created by Administrator on 2017/8/1 0001.
 */
Zepto(function ($) {
    // 自定义添加avalidate.js中的规则
    ac.addRule({
        tm: /^1(3|4|5|7|8)\d{9}$/i
    });
    // 对，就这么简单就初始化了。
    ac.form({
        area: 'main', // 验证区域，支持标签，id，class，推荐使用id或者class
        btn: '.logInBtn', // 触发验证的按钮或者元素，支持标签，id，class，推荐使用id或者class
        singleError: function (e, msg) {
            popBox(msg);
        },
        endSuccess: function () {
            // 验证成功执行登录方法
            var userName = $('#logIn-userName').val();
            var passWorld = $('#logIn-passWorld').val();
            console.log(userName, passWorld);
            logIn(userName, passWorld);
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
    // 登录方法 uName,pWord
    function logIn(userName, passWorld) {
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5login/userDefaultLogin',
            dataType: 'json',
            data: {
                loginId: userName,
                loginPwd: passWorld
            },
            success: function (date) {
                alert(111);
                if (date.state == 'success') {
                    window.localStorage.uid = date.userId;
                    popBox("登陆成功");
                    //window.location.href = window.localStorage.backUrl;
                    history.go(-1);
                }else{
                    popBox(date.errMsg);
                }
            },
            error: function () {
                alert('error');
            }
        });
    }
    // 去注册
    $('.goToRegister').tap(function () {
        window.location.href = 'register.html';
    });
    // 忘记密码
    $('.backPassWord').tap(function () {
        window.location.href = 'forgetPsd.html';
    });
});
