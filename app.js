//app.js
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function(options) {
    
  },
  onShow: function(options) {

  },
  onHide: function() {

  },
  onError: function(msg) {

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options) {

  },
  
  // 全局數據
  globalData: {
    // 項目運作時間
    projStartTime: [{
      Year: '2021',
      Month: '06',
      Day: '03',
    }],
    // 用戶信息全局變量
    userInfoGlobal: [
      { id:0, name:"UM ID:",    input:"未設置" },
      { id:1, name:"姓名:",     input:"未設置" },
      { id:2, name:"專業:",     input:"未設置" },
      { id:3, name:"年級:",     input:"未設置" },
      { id:4, name:"組織次數:", input:0 },
      { id:5, name:"參與次數:", input:0 }
    ],
    // 課程數據全局變量
    courseInfoGlobal: [
      { item:"主題: ", input:"xx" },
      { item:"時間: ", input:"xx" },
      { item:"地點: ", input:"xx" },
      { item:"Follow人數: ", input:"xx" },
      { item:"課程狀態: ", input:"xx" },
    ],
    // 簽到密碼
    attendCode:'',
    // 用戶註冊時間
    userSignUpTime:'',
    // 登錄狀態
    isSignIn:'',
    // 完sem日
    semFinishDay:'2022/01/05',
    // 畢業日
    graduateDay:'',
  }
});
