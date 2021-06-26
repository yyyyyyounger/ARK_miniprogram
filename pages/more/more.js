Page({
  data: {
    
  },
  onLoad: function(){
    
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

  },
  // 跳轉“關於”頁
  jumpToAbout () {
    wx.navigateTo({
      url: './about/about',
    });
  },
  // 跳轉“小功能”頁
  jumpToSmallFun () {
    wx.navigateTo({
      url: './smallFun/smallFun',
    });
  }
});