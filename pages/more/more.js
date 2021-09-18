import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

var cloudData = require('../../data/cloud.js')

Page({
  data: {
  },
  onLoad: function(){
    this.app = getApp();   
    let institutionNum = JSON.parse(JSON.stringify(cloudData.institutionNum));
    let institutionInfo = JSON.parse(JSON.stringify(cloudData.institutionInfo));
    this.setData({  
      institutionNum       : institutionNum,
      institutionInfo : institutionInfo,
    });
  },
  onReady: function(){
    
  },
  onShow: function(){
    this.getTabBar().init();
    this.setData({
      swiperAutoplay:true
    })
  },
  onHide: function(){
    this.setData({
      swiperAutoplay:false
    })
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

  bindOpenSetting (){
    console.log("已點擊");
    wx.openSetting({
      success (res) {
        console.log(res)
      }
    })
  },
  clearStorage () {
    let that = this;
    Dialog.confirm({
      // title: '标题',
      message: '確認要清除緩存嗎？將會重新啟動。',
    })
      .then(() => {
        // on confirm
        Toast.loading({
          message: '拼命加載中...',
          forbidClick: true,
        });
        // this.app.globalData.isSignIn = false;
        wx.clearStorage({
          success(){
            that.app.reload(that);
            wx.reLaunch({
              url: '../user/user'
            })
          }
        })
      }) .catch(() => {
        // on cancel
      });
    
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

  // 跳轉選咩課
  toOtherMiniProgram() {
    wx.navigateToMiniProgram({
        appId: 'wxd2449edafe0c532a',//要打开的小程序 appId
        path: '',//打开的页面路径，如果为空则打开首页。
        success(res) {
          // 打开成功
          console.log("跳轉成功");
        }
      })
  },
  //跳转学会介绍页
  toPartner(e){
    let pageNum = e.currentTarget.dataset.pagenum
    pageNum = JSON.stringify(pageNum);
    console.log(pageNum)
    wx.navigateTo({
      url: './about/partner/partner?pageNum=' + pageNum,
    })
  },
});