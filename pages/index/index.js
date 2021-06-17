Page({
  data: {
    isShow : false
  },
  // 時間軸的icon的點擊事件
  containerTap: function() {
    let{isShow} = this.data;
    isShow =! isShow;
    this.setData({
      isShow
    })
  },
  //options(Object)
  onLoad: function(options) {
    
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  