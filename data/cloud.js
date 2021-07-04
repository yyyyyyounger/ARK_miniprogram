var app = getApp();
var userInfoInput_empty = [
  { id:0, name:"UM ID:",    shortName:"umId",         input:"未登入", display:true,   canEdit:true },
  { id:1, name:"姓名:",     shortName:"name",         input:"未登入", display:true,   canEdit:true },
  { id:2, name:"專業:",     shortName:"studentMajor", input:"未登入", display:true,   canEdit:true },
  { id:3, name:"年級:",     shortName:"studentYear",  input:"未登入", display:true,   canEdit:true },
  { id:4, name:"組織次數:", shortName:"holdTimes",    input:0,        display:true,   canEdit:false },
  { id:5, name:"參與次數:", shortName:"joinTimes",    input:0,        display:true,   canEdit:false },
  { id:6, name:"星級:",     shortName:"stars",        input:0,        display:true,  canEdit:false },
  { id:7, name:"註冊時間:", shortName:"signUpTime",   input:"未登入",  display:true,  canEdit:false },
  { id:8, name:"ARKid:",   shortName:"arkId",        input:"未登入",  display:true,  canEdit:false },
  { id:9, name:"管理員:",   shortName:"admin",        input:false,    display:false, canEdit:false },
  {       name:"isSignUp:", shortName:"isSignUp",    input: false, },
];
var userInfoInput = [
  { id:0, name:"UM ID:",    shortName:"umId",         input:"DC025814", display:true,   canEdit:true },
  { id:1, name:"姓名:",     shortName:"name",         input:"LZY",  display:true,   canEdit:true },
  { id:2, name:"專業:",     shortName:"studentMajor", input:"ECE",  display:true,   canEdit:true },
  { id:3, name:"年級:",     shortName:"studentYear",  input:"大二", display:true,   canEdit:true },
  { id:4, name:"組織次數:", shortName:"holdTimes",    input:1,        display:true,   canEdit:false },
  { id:5, name:"參與次數:", shortName:"joinTimes",    input:5,        display:true,   canEdit:false },
  { id:6, name:"星級:",     shortName:"stars",        input:3,        display:true,  canEdit:false },
  { id:7, name:"註冊時間:", shortName:"signUpTime",   input:"2021/07/04",  display:true,  canEdit:false },
  { id:8, name:"ARKid:",   shortName:"arkId",        input:"001",   display:true,  canEdit:false },
  { id:9, name:"管理員:",   shortName:"admin",        input:true,    display:false, canEdit:false },
  {       name:"註冊狀態：", shortName:"isSignUp",    input: false, },
];

// 完sem日
var semFinishDay = '2022/01/05';
var studentYear = ["大一", "大二", "大三", "大四"];
var studentMajor = ["ECE", "CPS", "xxx"];


function writeUserInfoInput () {
  if (userInfoInput[9].input) {
    userInfoInput[9].display = true;
    // console.log("管理員：",userInfoInput[9]);
  }
  app.globalData.userInfoInput = userInfoInput;
}
// 數據output
module.exports = {
  // 出口名為testJsonList，類型為jsonDIY數據
  userInfoInput :         userInfoInput,
  userInfoInput_empty :   userInfoInput_empty,
  semFinishDay :          semFinishDay,
  studentYear :           studentYear,
  studentMajor :          studentMajor,

  writeUserInfoInput :    writeUserInfoInput,
}