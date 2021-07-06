Page({
  data: {
    
  },
  onLoad: function() {
    this.app = getApp();
    // 模擬向服務器請求的延時
    // this.app.toastLoadingDIY();
  },
  onReady: function() {
    
  },
  onShow: function() {
    this.getTabBar().init();
  },
  onHide: function() {

  },
  onPullDownRefresh: function() {
    this.app.onPullDownRefresh(this);
  },



  // 跳轉規則
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
  