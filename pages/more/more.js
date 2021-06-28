
Page({
  data: {
    
  },
  onLoad: function(){
    this.app = getApp();
    
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
    this.app.onPullDownRefresh(this);
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
  },
  // 跳轉“反饋”頁
  jumpToFeedBack () {
    wx.navigateTo({
      url: './feedBack/feedBack',
    });
  },
  bindOpenSetting (){
    console.log("已點擊");
    wx.openSetting({
      success (res) {
        console.log(res)
      }
    })
  },
});