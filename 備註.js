// 在.js文件中獲取時間的辦法：

//获取当前时间戳
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
console.log("当前时间戳为：" + timestamp);
console.log("timestamp為 ",timestamp);
//获取当前时间
var n = timestamp * 1000;
console.log("n為 ",n);
var date = new Date(n);
console.log("date為 ",date);
//年
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
//时
var h = date.getHours();
//分
var m = date.getMinutes();
//秒
var s = date.getSeconds();
console.log("当前时间：" +Y+M+D+h+":"+m+":"+s);

//转换为时间格式字符串
console.log(date.toDateString());
console.log(date.toGMTString());
console.log(date.toISOString());
console.log(date.toJSON());
console.log(date.toLocaleDateString());
console.log(date.toLocaleString());
console.log(date.toLocaleTimeString());
console.log(date.toString());
console.log(date.toTimeString());
console.log(date.toUTCString());