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
    // 用戶信息全局變量
    UM_id_local : "未設置",
    student_year : "未設置",
    student_major : "未設置",
    hold_time : "未設置",
    join_time : "未設置",
    userInfoGlobal: [
      { id:0, name:"UM ID:", input:"未設置" },
      { id:1, name:"姓名:", input:"未設置" },
      { id:2, name:"專業 & 年級:", input:"未設置" },
      { id:3, name:"組織次數:", input:"未設置" },
      { id:4, name:"參與次數:", input:"未設置" },
    ]
  }
});
  