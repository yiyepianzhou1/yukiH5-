function _Ajax (type,url,data,callback) {

    $.ajax({
        type: type,
        url: url,
        // data to be added to query string:
        contentType:'application/x-www-form-urlencoded;charset=utf-8',
        data: data,
        // type of data we are expecting in return:
        dataType: 'json',
        timeout: 300,
        success: function(data){
            callback(null, data);
        },
        error: function(xhr, type){
            callback({xhr, type}, null);
        }
    })
}
/*添加内容的的方法*/
function showListAppend(select, data,callback,type) {
    if (type) {
        console.log(JSON.stringify(callback(data)));
        $(select).append(pagefn(data));
    } else {
        console.log('禁止渲染');
    }
}
//        覆盖内容的方法
function showListOverride(select, data, callback,type) {
    if (type) {
        console.log(JSON.stringify(callback(data)));
        $(select).html(pagefn(data));
    } else {
        console.log('禁止渲染');
    }
}