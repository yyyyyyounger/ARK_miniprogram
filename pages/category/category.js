Page({
  data: {
    
  },
  onLoad: function() {
    this.app = getApp();
    // 模擬向服務器請求的延時
    this.app.toastLoadingDIY();
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
    this.app.onPullDownRefresh(this);
  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  onTabItemTap:function(item) {

  },
  jumpToallCourses (){
    wx:wx.navigateTo({
      url: './allCourses/allCourses',
    })
  },
  jumpTomyFollowCourses (){
    wx:wx.navigateTo({
      url: './myFollowCourses/myFollowCourses',
    })
  },
  jumpTomyJoinCourses (){
    wx:wx.navigateTo({
      url: './myJoinCourses/myJoinCourses',
    })
  },
  jumpToholdACourses (){
    wx:wx.navigateTo({
      url: './holdACourses/holdACourses',
    })
  },
});
  