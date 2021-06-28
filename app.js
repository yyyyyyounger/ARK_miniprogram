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
  },

// 計算剩下日期
  calcDurationDay(that,pastOrFuture,date_input) {
    // 獲取當前時間軸
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    // console.log("当前时间戳为：" + timestamp);
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let today = Y+'/'+M+'/'+D;
    console.log("Today is",today);
    console.log("The target date is",date_input);
    let durationDay = 0;
    if (pastOrFuture==1) {
      // 過去到今天的持續時間
     durationDay = (new Date(today).getTime() - new Date(date_input).getTime()) / (1000 * 60 * 60*24);
    }
    else{
      // 今天到未來某日的持續時間
     durationDay = (new Date(date_input).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    }
    that.setData({
      durationDay,
      today
    })
    console.log("The duration day is",durationDay);
  },

// 動畫設置
  //渐入，渐出实现 
  show : function(that,param,opacity){
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //滑动渐入渐出
  slideupshow:function(that,param,px,opacity){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //向右滑动渐入渐出
  sliderightshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }
});
