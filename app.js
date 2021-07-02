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
// 自定義Toast樣式，保證全局一樣
  toastLoadingDIY : function() {
    wx.showToast({
      title: '作者真帥😎',
      icon: 'loading'
    })
  },
// 下拉刷新函數，調用該函數可保證刷新完回彈
  onPullDownRefresh : function(that) {   
    that.app.toastLoadingDIY();
    setTimeout(() => {
      that.onLoad();
    }, 2500);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
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
      { id:0, name:"UM ID:",    input:"未登入", display:true },
      { id:1, name:"姓名:",     input:"未登入", display:true },
      { id:2, name:"專業:",     input:"未登入", display:true },
      { id:3, name:"年級:",     input:"未登入", display:true },
      { id:4, name:"組織次數:", input:0,        display:true },
      { id:5, name:"參與次數:", input:0,        display:true },
      { id:6, name:"註冊時間:", input:"未登入",  display:true },
      { id:7, name:"管理員:",   input:"no one", display:false },
    ],
    // 課程數據全局變量
    courseInfoGlobal: [
      { item:"主題: ", input:"xx" },
      { item:"時間: ", input:"xx" },
      { item:"地點: ", input:"xx" },
      { item:"Follow人數: ", input:"xx" },
      { item:"課程狀態: ", input:"xx" },
      { item:"簽到密碼: ", input:"xx" },
    ],
    // 用戶註冊相關
    // 註冊狀態,是否已註冊
    isUserSignUp: false,
    // 登錄狀態
    isSignIn: false,
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
    // console.log("Today is",today);
    // console.log("The target date is",date_input);
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
  },

  sliderAnimaMode: function (that,name,move,inOut,mode,delay){
    // that為調用段設置this，作為傳參
    // name為wxml設置綁定變量名，需為''類型
    // move為移動距離，±數字
    // inOut，進入/加載時為1，退出/隱藏時為0
    // mode設置up模式(0) or right模式(1)
    // delay為出現延時

    // this.app.slideupshow(this, 'slide_up1', -200, 1);
    //第一个参数是当前的页面对象，方便函数setData直接返回数据
    //第二个参数是绑定的数据名,传参给setData,供wxml綁定
    //第三个参数是上下滑动的px,因为class="init"定义初始该元素向下偏移了200px，所以这里使其上移200px
    //第四个参数是需要修改为的透明度，这里是1，表示从初始的class="init"中定义的透明度0修改到1
    setTimeout(function () {
      if (!mode) {
        that.app.slideupshow(that, name, move, inOut)
      }
      else{
        that.app.sliderightshow(that, name, move, inOut)
      }
    }.bind(that), delay);
  },
});
