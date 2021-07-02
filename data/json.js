var app = getApp();
var userInfoGlobal = [
  { id:0, name:"UM ID:",    input:"DC025814", display:true },
  { id:1, name:"姓名:",     input:"LZY",      display:true },
  { id:2, name:"專業:",     input:"CPS",      display:true },
  { id:3, name:"年級:",     input:"大二",     display:true },
  { id:4, name:"組織次數:", input:1,          display:true },
  { id:5, name:"參與次數:", input:5,          display:true },
  { id:6, name:"註冊時間:", input:"未完善",   display:true },
  { id:7, name:"管理員:",   input:true,      display:false },
];


function writeUserInfoGlobal () {
  if (userInfoGlobal[7].input) {
    userInfoGlobal[7].display = true;
    console.log("管理員：",userInfoGlobal[7]);
  }
  app.globalData.userInfoGlobal = userInfoGlobal;
}
// 數據output
module.exports = {
  // 出口名為testJsonList，類型為jsonDIY數據
  testJsonList:userInfoGlobal,
  writeUserInfoGlobal:writeUserInfoGlobal,
}