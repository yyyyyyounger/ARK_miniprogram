import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

var cloudData = require('../../data/cloud.js')

Page({
  data: {
  },
  onLoad: function(){
    this.app = getApp();   
    let institutionInfo = JSON.parse(JSON.stringify(cloudData.institutionInfo));
    let institutionNum = institutionInfo.length;
    this.setData({  
      institutionNum       : institutionNum,
      institutionInfo : institutionInfo,
    });
    const userCloudDataStorage = wx.getStorageSync('userCloudData')
    if (!!userCloudDataStorage) {
      this.setData({  admin : userCloudDataStorage.data.admin  })
    }
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
  onPullDownRefresh: function(){
    this.app.onPullDownRefresh(this);
  },
  onShareAppMessage: function(){

  },

  bindOpenSetting (){
    console.log("已點擊");
    wx.openSetting({
      success (res) {
        console.log(res)
      }
    })
  },
  // 清除緩存
  clearStorage () {
    let that = this;
    Dialog.confirm({
      title: '操作提示',
      message: '確認要清除緩存嗎？\n將會重新啟動。',
      zIndex : '9999999'
    })
    .then((e) => {
      console.log('確認清除');
      // this.app.globalData.isSignIn = false;
      wx.clearStorage({
        success(){
          that.app.reload(that);
          wx.reLaunch({
            url: '../user/user'
          })
        }
      })
    }) 
    .catch((err) => {
      // on cancel
      console.log('取消清除');
      console.error(err);
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
  // 跳轉“測試”頁
  jumpToTestPage () {
    wx.navigateTo({
      url: '../test/test'
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