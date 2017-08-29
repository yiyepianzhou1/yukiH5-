//今天
var today1 = new Date();
console.log(today1.valueOf());
var today = today1;
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
//一天的时间戳
var oneday = 1000 * 60 * 60 * 24;//?
console.log(today1.valueOf()+oneday);

//明天零点时间
var tomorrow = new Date(today.valueOf() + oneday);//?
console.log(tomorrow, tomorrow.valueOf());
var leftTime = tomorrow.valueOf() - today1.valueOf();/*?*/
console.log(leftTime);