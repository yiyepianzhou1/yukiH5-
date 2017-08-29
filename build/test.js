"use strict";

/**
 * Created by Administrator on 2017/7/31 0031.
 */
var b = function b(foo) {
  return foo + "hello world";
};
//今天
var timestamp = new Date().valueOf(); //?
var today1 = new Date();
console.log(today1);
var today = today1;
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
//一天的时间戳
var oneday = 1000 * 60 * 60 * 24;
//明天零点时间
var tomorrow = new Date(today.valueOf() + oneday);
console.log(tomorrow.valueOf());
var leftTime = tomorrow - timestamp; //单位毫秒
console.log(leftTime);

var data = { "": "1511111,3333" };
var dataJson = JSON.stringify(data); //?
console.log(Object.values(data));