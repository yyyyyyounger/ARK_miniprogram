var cloudData = require('../../data/cloud');
var towxml = require('../../towxml/index');
const { el } = require('../../towxml/parse/parse2/entities/maps/entities');
var app = getApp();

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';


Page({
  data: {
    article: {},                     // 渲染內容數據
    isLoading: true,                    // 判断是否尚在加载中

  },
  onLoad: function(options){
    if (options.detailInfo) { //存在帶參跳轉
      // 獲取跳轉的參數
      let detailInfo = JSON.parse(options.detailInfo)
      console.log(detailInfo.mode);
  
      // 如果此處的mode為signUp，則底部需要有同意按鈕，點擊後全局寫入haveReadProtocol = true
      this.setData({  displayButton : true  })
    }

    this.setData({  ARK: cloudData.ARK  });
    let result = towxml(this.data.ARK,'markdown',);
    this.setData({
      article:result,
      isLoading: false,
    });

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
      app.globalData.haveReadProtocol = true;
      wx.navigateBack();
    }
    else{
      app.globalData.haveReadProtocol = false;
      Toast('作者也很為難 ┓( ´∀` )┏');
    }
  },
  
});