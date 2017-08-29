/**
 * Created by Administrator on 2017/8/1 0001.
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
        btn: '#register-next', // 触发验证的按钮或者元素，支持标签，id，class，推荐使用id或者class
        singleError: function (e, msg) {
            popBox(msg);
        },
        endSuccess: function () {
            // 验证成功执行登录方法
            var verificationCode = $('#register-verificationCode-input').val();
            console.log(userName, verificationCode);
            nextSend(userName, verificationCode);
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
    // 监听号码输入框字数
    $('#logIn-userName').on('input', function () {
        // 实时监听手机号码输入框变化
        if ($(this).val().length === 11) {
            // 输入框内有十一位数字时，改变发送验证码按钮的样式
            $('.sendVerificationCode').removeClass('disabled').css({ background: '#4595e5' });
        } else {
            // 输入框内容不为11位手机号，改变按钮样式
            if (!$('.sendVerificationCode').hasClass('disabled')) {
                $('.sendVerificationCode').addClass('disabled').css({ background: '#cccccc' });
            }
        }
    });
    // 发送验证码
    var userName = null;
    $('.sendVerificationCode').on('touchend', function () {
        console.log(111);
        userName = $('#logIn-userName').val();
        if (regSend(userName)) {
            sendCode(userName);
        } else {
            popBox('请输入正确的手机号');
        }
    });
    function sendCode(phoneNumber) {
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5sendsms/sendSMSForRegister',
            dataType: 'json',
            data: {
                phone: phoneNumber
            },
            beforeSend: function () {
                $('.sendVerificationCode').addClass('disabled').css({ background: '#cccccc' });
            },
            success: function (date) {
                countDown();
                if (date.state == 'error') {
                    popBox(date.errMsg);
                }
            },
            error: function () {
                popBox('网络错误');
            }
        });
    }
    // 发送短信时验证手机号
    function regSend(mobile) {
        var myreg = /^1(3|4|5|7|8)\d{9}$/i;
        return myreg.test(mobile);
    }
    // 验证码倒计时
    function countDown() {
        var time = 60;
        function daojishi() {
            time--;
            $('.sendVerificationCode').text(time + 's后重试');
            if (time < 1) {
                clearInterval(iCount, 60000);
                $('.sendVerificationCode').text('获取验证码').removeClass('disable');
            }
        }
        var iCount = setInterval(daojishi, 1000);
    }
    // 下一步
    function nextSend(phoneNumber, smscode) {
        $.ajax({
            type: 'post',
            url: 'http://192.168.0.178:8084/h5/h5register/registerCheckPhone',
            dataType: 'json',
            data: {
                phone: phoneNumber,
                smscode: smscode
            },
            success: function (date) {
                console.log(date.data.state);
                if (date.data.state == 'success') {
                    window.localStorage.phoneNumber = phoneNumber;
                    window.localStorage.smscode = smscode;
                    window.location.href = 'registerNext.html';
                }
            },
            error: function () {
                popBox('网络错误');
            }
        });
    }
});
