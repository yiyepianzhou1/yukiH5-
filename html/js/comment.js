Zepto(function ($) {
    var img_group = [];
    $('.comment-content-list').find('.comment-item').find('.image-group').find('.photo-item').find('img').each(function (index) {
        console.log(index);
        img_group.push($(this).attr('src'));
        $(this).attr('data-index', index);
        $(this).on('tap', function (event) {
            var index = $(this).attr('data-index');
            console.log(index);
            if (index !== undefined && index !== null) {
                imageViewer.open(parseInt(index));
            }
        });
    });

    console.log(img_group);
    var imageViewer = new ImageViewer(img_group, {
        container: 'body',
        enableScale: true,
        startIndex: 0,
        headerRender: function () {
            setTimeout(function () {
                document.getElementById('close').addEventListener('click', function () {
                    imageViewer.close();
                }, false);
            }, 0);
            return '<div id="close">关闭</div>';
        },
        footerRender: function () {
            return '<span class="number-current"></span>/<span class="number-total"></span>';
        },
        beforeSwipe: function (current) {
            console.info('current-before: ' + current);
        },
        afterSwipe: function (current) {
            console.info('current-after: ' + current);
        },
        swipeLastLeft: function (imageViewer, distance) {
            console.log('swipeLastLeft', distance);
            if (distance > 50) {
                popBox('亲，我也是有底线的！');
                return true;
            }
        },
        swipeFirstRight: function (imageViewer, distance) {
            popBox('亲，到顶了！');
            console.log('swipeFirstRight', distance);
            if (distance > 30) {
                // imageViewer.setImageOption(['images/5.jpg', 'images/6.jpg', 'images/7.jpg']);
                return true;
            }
        }
    });
    // 弹窗 ，2秒后消失
    function popBox(msg) {
        console.log('msg' + msg);
        $('.image-footer').append(
            '<div class="hintPopBox">\
            <div class="hintPop">' + msg + '</div>\
                </div>'
        );
        setTimeout(removePopBox, 2000);
        function removePopBox() {
            $('.hintPopBox').remove();
        }
    }
});

