/**
 * Created by Administrator on 2017/8/3 0003.
 */
Zepto(function ($) {
    // 自定义添加avalidate.js中的规则
    ac.addRule({
        tm: /^1(3|4|5|7|8)\d{9}$/i,
        tp: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/i
    });
    // 对，就这么简单就初始化了。
    ac.form({
        area: 'main', // 验证区域，支持标签，id，class，推荐使用id或者class
        btn: '.register-finish', // 触发验证的按钮或者元素，支持标签，id，class，推荐使用id或者class
        singleError: function (e, msg) {
            popBox(msg);
        },
        endSuccess: function () {
            // 验证成功执行登录方法
            var password = $('#register-password').val();
            var rePassword = $('#register-rePassword').val();
            console.log(password, rePassword);
            if (password != rePassword) {
                popBox('两次密码输入不一致');
            } else {
                registerFinish(rePassword, window.localStorage.code);
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
    // 注册完成
    function registerFinish(rePassword, code) {
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5sendsms/checkSMSLogForForgetPwd',
            dataType: 'json',
            data: {
                phone: localStorage.phoneNumber,
                code: code,
                pwd: rePassword
            },
            success: function (date) {
                if (date.state == 'error') {
                    popBox(date.errMsg);
                }
                if (date.state == 'success') {
                    popBox(date.successMsg);
                    window.location.href = 'logIn.html';
                }
            },
            error: function () {
                popBox('网络错误');
            }
        });
    }
});
