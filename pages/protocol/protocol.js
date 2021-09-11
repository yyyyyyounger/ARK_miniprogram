// 2021.8.8更新：將註冊的最後一步改為帶參跳轉後的協議頁同意按鈕
var app = getApp();

var cloudData = require('../../data/cloud');
var towxml = app.require('/towxml/index');

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    article: {},                     // 渲染內容數據
    isLoading: true,                    // 判断是否尚在加载中
  },
  onLoad: function(options){
    if (options.detailInfo) { //存在帶參跳轉
      // 獲取跳轉的參數
      let detailInfo = JSON.parse(options.detailInfo)
      console.log("跳轉mode為",detailInfo.mode);  
      // 如果此處的mode為signUp，則底部需要有同意按鈕，點擊後全局寫入haveReadProtocol = true
      this.setData({  displayButton : true  })
      // 將註冊信息寫入data
      this.setData({
        userInfo      : detailInfo.userInfo,
        userInfoInput : detailInfo.userInfoInput,
      })
      // 匹配出shortName的index，生成為一個對象形式
      let shortNameIndex={};
      this.data.userInfoInput.map(function (e,index,item) {    // 究極優化！本質上一行代碼匹配出所有index
        shortNameIndex[e.shortName] = index;
      });
      this.setData({  shortNameIndex  })
    }

    // 渲染ARK協議 - ARK協議在cloud.js修改
    this.setData({
      article   : towxml(cloudData.ARK,'markdown'),
      isLoading : false,
    })

  },
  onShow: function(){
    
  },
  onHide: function(){

  },

  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },

  // 同意或不同意協議按鈕
  bindTapButton: function(e){
    if (e.currentTarget.dataset.click == "confirm") {
      this.userSignUp();
    }
    else{
      app.globalData.haveReadProtocol = false;
      Toast('作者也很為難 ┓( ´∀` )┏');
    }
  },

  // 調用雲函數, 新增用戶
  userSignUp() {
    Dialog.confirm({
      title: '系統提示',
      message: '確定同意ARK協議嗎？\n如認為可作修改可以聯繫管理員！',
    })
    .then(() => {
      // on confirm - 調用雲函數
      Toast.loading({
        message: '瘋狂請求中...',
        forbidClick: true,
      });

      let that = this;
      that.getNowTime();    // 獲取現時時間
      that.setData({  ['userInfoInput['+that.data.shortNameIndex.signUpTime+'].input'] : that.data.today,  })
      // 修改本地註冊狀態為 true
      that.data.userInfoInput[that.data.shortNameIndex.isSignUp].input = true;
      app.globalData.userInfoInput = JSON.parse(JSON.stringify(that.data.userInfoInput));

      //調用雲函數 userSignUp 完成數據上傳
      wx.cloud.callFunction({
        name: 'userSignUp',
        data:{
            avatarUrl     : that.data.userInfo.avatarUrl,
            nickName      : that.data.userInfo.nickName,
            gender        : that.data.userInfo.gender,        // 1：男        2：女
            userInfoInput : that.data.userInfoInput,
        }
      }).then(res=>{
        console.log(res);
        app.globalData.haveReadProtocol = true;
        // 提示成功
        Dialog.confirm({
          title: '系統提示',
          message: '恭喜！您已成功註冊！\n現在返回個人信息頁嗎？',
        }) .then(() => {
          // on confirm - 重啟回退
          wx.reLaunch({
            url: '../user/user',
          })
        }) .catch(() => {
          // on cancel
        });
      }) .catch(err=>{  console.error(err);  })
    })
    .catch(() => {
      // on cancel
    });
  },

  // 獲取現時時間
  getNowTime(){
    // 獲取當前時間軸
    var timestamp = Date.now();
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let today = Y+'/'+M+'/'+D;
    this.setData({ today })
  },
  
});