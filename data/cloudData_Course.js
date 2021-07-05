var classInfo_empty = [
  { id:0, name:"分享编號:", shortName:"courseId",       input:"None",                    canEdit:false,     canDisplay:true },  // 雲端給該課程分配的編號
  { id:1, name:"分享主題:", shortName:"courseName",     input:"None",                    canEdit:true,      canDisplay:true },   // 講者設定的主體
  { id:2, name:"分享內容:", shortName:"courseContent",  input:"None",                    canEdit:true,      canDisplay:true },   // 建設設定的課程詳細說明
  { id:3, name:"分享分類:", shortName:"courseClass",    input:["None", "None", "None",], canEdit:true,      canDisplay:true },   // 設定標籤，便於搜索，例如ECEN、編程
  { id:4, name:"分享地址:", shortName:"courseAdres",    input:"None",                    canEdit:true,      canDisplay:true },   // 講者設定的課程地址
  { id:5, name:"分享時間:", shortName:"courseTime",     input:"None",                    canEdit:true,      canDisplay:true },   // 講者設定的課程舉辦時間
  { id:6, name:"講師:",     shortName:"speakerName",    input:"None",                    canEdit:true,      canDisplay:true },   // 講者設定名稱(可編輯) 或 直接獲取講者的名稱(不可編輯)
  { id:7, name:"講師id:",   shortName:"speakerid",      input:"None",                    canEdit:false,     canDisplay:false },   // 講者的ARKid或UMid
  { id:8, name:"助手:",     shortName:"helperName",     input:"None",                    canEdit:true,      canDisplay:true },   // 同上
  { id:9, name:"助手id:",   shortName:"helperid",       input:"None",                    canEdit:false ,    canDisplay:false },
  { id:10, name:"追蹤人數:", shortName:"followers",     input:"None",                    canEdit:true,      canDisplay:true },    // 該分享受追蹤的人數
  { id:11, name:"課程狀態:", shortName:"courseState",   input:"None",                    canEdit:true,      canDisplay:true },    // 可設定為 "預備中", "講課中", "已結束"
  { id:12, name:"簽到密碼:", shortName:"attendCode",    input:"None",                    canEdit:true,      canDisplay:true },    // 簡明易了
];

// let userInfoInput_empty = [
//     { id:0, name:"UM ID:",    shortName:"umId",         input:"未登入", display:true,   canEdit:true },
//     { id:1, name:"姓名:",     shortName:"name",         input:"未登入", display:true,   canEdit:true },
//     { id:2, name:"專業:",     shortName:"studentMajor", input:"未登入", display:true,   canEdit:true },
//     { id:3, name:"年級:",     shortName:"studentYear",  input:"未登入", display:true,   canEdit:true },
//     { id:4, name:"組織次數:", shortName:"holdTimes",    input:0,        display:true,   canEdit:false },
//     { id:5, name:"參與次數:", shortName:"joinTimes",    input:0,        display:true,   canEdit:false },
//     { id:6, name:"星級評分:", shortName:"stars",        input:0,        display:true,  canEdit:false },
//     { id:7, name:"註冊時間:", shortName:"signUpTime",   input:"未登入",  display:true,  canEdit:false },
//     { id:8, name:"ARKid:",   shortName:"arkId",        input:"未登入",  display:true,  canEdit:false },
//     { id:9, name:"管理員:",   shortName:"admin",        input:false,    display:false, canEdit:false },
//     {       name:"isSignUp:", shortName:"isSignUp",    input: false, },
// ];