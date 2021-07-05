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