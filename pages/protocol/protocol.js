var cloudData = require('../../data/cloud');
var towxml = require('../../towxml/index');

Page({
  data: {
    article: {},                     // 渲染內容數據
    isLoading: true,                    // 判断是否尚在加载中

  },
  onLoad: function(){
    this.setData({  ARK: cloudData.ARK  });
    let result = towxml(this.data.ARK,'markdown',);
    this.setData({
      article:result,
      isLoading: false,
    });

  },
  onReady: function(){

  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  onTabItemTap:function(item){

  }
});