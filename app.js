// 全局備註：用戶信息等的讀取權限，應好好配置，當前階段為方便設置為所有人可讀

import cloud from './data/cloud';
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';
import Notify from './miniprogram_npm/@vant/weapp/notify/notify';

// var b = JSON.parse(JSON.stringify(數組a));  複製一份數組a的數據到數組b
// var date = new Date(Date.parse(new Date()));    // Date.parse(new Date()) 和 Date.now()為當前時間戳 - 數字。new Date(時間戳)後化為帶有中文的字符串
// console.log(date.toLocaleDateString());

//app.js
App({
  onLaunch: function(options) {
    wx.cloud.init({
      env: 'cloud1-5gtulf1g864cd4ea'
    })
    .then(res=>{
      const db = wx.cloud.database();   // 數據庫
      db.collection('config') .doc('clearStorage') .field({
        _openid : false,
      }) .get() 
      .then(res => {
        // console.log("雲端控制清除緩存信息：",res.data);
        const clearStorageOrder = wx.getStorageSync('clearStorage');
        if (!clearStorageOrder) { // 如果不存在clearStorageOrder的緩存
          console.log("目前沒有clearStorageOrder的緩存，現在獲取！");
          wx.setStorageSync('clearStorage', { time:res.data.createAt, order:res.data.order } )
        } else {                  // 存在clearStorageOrder緩存
          console.log("存在clearStorageOrder緩存",clearStorageOrder);
          if ( clearStorageOrder.time != res.data.createAt ) {  // 與雲端設置的時間不符
            console.log("order數據已過期，清除緩存並設置新order時間戳");
            // 緩存過期，刪除
            wx.clearStorageSync();
            wx.setStorageSync('clearStorage', { time:res.data.createAt, order:res.data.order } )
          } else {
            console.log("已執行過雲端的clearOrder");
          }
        }

      })
      .then(res=> {
        const userInfoStorage = wx.getStorageSync('userInfo');
        if (!userInfoStorage) { //如果不存在userInfo的緩存
          console.log("目前沒有userInfo的緩存");
        } else {
          if (Date.now() - userInfoStorage.time > 7*24*60*60*1000 ) {  // 7天有效期
            console.log("userInfo數據已過期");
            // 緩存過期，刪除
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('userCloudData');
          } else {
            console.log("app - userInfo緩存為：",userInfoStorage);
            this.globalData.isSignIn = true;
          }
        }
      })
      .catch(err=>{
        console.error(err);
      })
    })
    .catch(err=>{
      console.error(err);
    })

  },
  onShow: function(options) {
    // 小程序更新邏輯 - 唯有上線版可以實現該功能
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("下載更新包狀態：",res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已準備好，是否重啟應用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败提示
      Toast.fail({
        message: '更新失敗，請關閉小程序重開',
        zIndex: 9999999,
      });
    })
  },
  onHide: function() {
    
  },
  onError: function(msg) {
    // Notify({ type: 'warning', message: msg });
  },
//options(path,query,isEntryPage)
  onPageNotFound: function(options) {

  },
// 自定義Toast樣式，保證全局一樣
  toastLoadingDIY : function() {
    Toast.loading({
      message: '拼命加載中...',
      forbidClick: true,
    });
  },
// 下拉刷新函數，調用該函數可保證刷新完回彈
  onPullDownRefresh : function(that) {
    that.app.toastLoadingDIY();
    // setTimeout(() => {
    that.onLoad("refresh");
    // }, 2500);
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
    userInfoInput: [],
    userInfoInput_empty: [],
    // 用戶微信登錄狀態
    isSignIn: false,
    // 協議同意狀態
    haveReadProtocol : false,

    // 完sem日
    semFinishDay:'2022/01/05',
    // 畢業日
    graduateDay:'',

    
  },
  // 重設app.js的值，用於清除緩存，重啟小程式
  reload(that) {
    // 項目運作時間
    that.app.globalData.projStartTime= [{
      Year: '2021',
      Month: '06',
      Day: '03',
    }];
    // 用戶信息全局變量
    that.app.globalData.userInfoInput = [];
    that.app.globalData.userInfoInput_empty = [];
    // 用戶微信登錄狀態
    that.app.globalData.isSignIn = false;

    // 完sem日
    that.app.globalData.semFinishDay='2022/01/05';
    // 畢業日
    that.app.globalData.graduateDay='';
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
