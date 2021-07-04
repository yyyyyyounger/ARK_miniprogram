var app = getApp();
var userInfoGlobal_empty = [
  { id:0, name:"UM ID:",    input:"未登入", display:true,   canEdit:true },
  { id:1, name:"姓名:",     input:"未登入", display:true,   canEdit:true },
  { id:2, name:"專業:",     input:"未登入", display:true,   canEdit:true },
  { id:3, name:"年級:",     input:"未登入", display:true,   canEdit:true },
  { id:4, name:"組織次數:", input:0,        display:true,   canEdit:false },
  { id:5, name:"參與次數:", input:0,        display:true,   canEdit:false },
  { id:6, name:"星級:",     input:0,        display:true,  canEdit:false },
  { id:7, name:"註冊時間:", input:"未登入",  display:true,  canEdit:false },
  { id:8, name:"ARKid:",    input:"未登入",  display:true,  canEdit:false },
  { id:9, name:"管理員:",   input:false,    display:false, canEdit:false },
  { isUserSignUp: false, },
];
var userInfoGlobal = [
  { id:0, name:"UM ID:",    input:"DC025814", display:true, canEdit:true },
  { id:1, name:"姓名:",     input:"LZY",      display:true, canEdit:true },
  { id:2, name:"專業:",     input:"ECE",      display:true, canEdit:true },
  { id:3, name:"年級:",     input:"大二",     display:true, canEdit:true },
  { id:4, name:"組織次數:", input:1,          display:true, canEdit:false },
  { id:5, name:"參與次數:", input:5,          display:true, canEdit:false },
  { id:6, name:"星級:",     input:0,         display:true,   canEdit:false },
  { id:7, name:"註冊時間:",  input:"2021/07/04",  display:true,   canEdit:false },
  { id:8, name:"ARKid:",    input:"001",    display:true,  canEdit:false },
  { id:9, name:"管理員:",   input:true,      display:false, canEdit:false },
  { isUserSignUp: true, },
];


function writeUserInfoGlobal () {
  if (userInfoGlobal[9].input) {
    userInfoGlobal[9].display = true;
    // console.log("管理員：",userInfoGlobal[9]);
  }
  app.globalData.userInfoGlobal = userInfoGlobal;
}
// 數據output
module.exports = {
  // 出口名為testJsonList，類型為jsonDIY數據
  userInfoGlobal:userInfoGlobal,
  userInfoGlobal_empty:userInfoGlobal_empty,
  writeUserInfoGlobal:writeUserInfoGlobal,
}