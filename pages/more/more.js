import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {  
    institutionInfo:[{
      id:0,
      iconSrc:'https://i.loli.net/2021/08/24/mQj168BbwCuJOUN.jpg',
      name:'電腦學會',
    },
    {
      id:1,
      iconSrc:'https://i.loli.net/2021/08/24/PIh8sfRW9yMn2CD.jpg',
      name:'IET澳門學生支部',
    },] 
  },
  onLoad: function(){
    this.app = getApp();
    
  },
  onReady: function(){
    
  },
  onShow: function(){
    this.getTabBar().init();
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
        that.app.toastLoadingDIY();
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
    let selectItemIndex = e.currentTarget.dataset.id; 
    console.log(selectItemIndex);
    wx.navigateTo({
      url: './about/partner/partner',
    })
  }
});