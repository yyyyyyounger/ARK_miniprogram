var wemark = require('../../wemark/wemark');

Page({
  data: {
    // 确定一个数据名称
    wemark:{}
  },
  onLoad: function(){
    
  },
  onReady: function(){
    wemark.parse(md, this, options);
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