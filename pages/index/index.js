var app = getApp(); 

Page({
  data: {
    isShow : false,
    projStartTime: [],
    today:'',
    durationDay:0,
  },
  onLoad: function() {
    this.app = getApp();

    this.setData({
      projStartTime : app.globalData.projStartTime[0]
    });
    console.log("項目開始時間："+this.data.projStartTime.Year +'/'+ this.data.projStartTime.Month +'/'+ this.data.projStartTime.Day);
    // 計算已過日期
    this.app.calcDurationDay(this,1,'2021/06/03');
    this.onShow();
    console.log("onLoad() - index加載完成");
  },
  onShow (){  //頁面展示時，觸發動畫
    this.app.sliderAnimaMode(this, 'slide_up1', -550, 1, 0, 0);
    this.app.sliderAnimaMode(this, 'slide_up2', -550, 1, 0, 300);
    this.app.sliderAnimaMode(this, 'slide_up3', -550, 1, 0, 600);
    this.app.sliderAnimaMode(this, 'slide_up4', -550, 1, 0, 900);
  },
  onHide (){  //頁面隱藏時，觸發漸出動畫
    this.app.sliderAnimaMode(this, 'slide_up1', 550, 0, 0, 0);
    this.app.sliderAnimaMode(this, 'slide_up2', 550, 0, 0, 300);
    this.app.sliderAnimaMode(this, 'slide_up3', 550, 0, 0, 600);
    this.app.sliderAnimaMode(this, 'slide_up4', 550, 0, 0, 900);
    this.app.sliderAnimaMode(this, 'slide_up5', -550, 0, 0, 0);
    this.app.sliderAnimaMode(this, 'slide_up6', -550, 0, 0, 0);

    console.log("onHide() - index觸發");
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onPageScroll(e) {
    // console.log(e.scrollTop);
    if (e.scrollTop>60) {
      this.app.sliderAnimaMode(this, 'slide_up5', -550, 1, 0, 0);
      if (e.scrollTop>380) {
        this.app.sliderAnimaMode(this, 'slide_up6', -550, 1, 0, 0);
      }
    }
  },
  // 跳轉“協議”頁
  handleTapProtocol () {
    console.log("跳轉ARK協議頁");
    wx:wx.navigateTo({
      url: '../protocol/protocol'
    });
  },
  // 跳轉“關於”頁
  jumpToAbout () {
    wx.navigateTo({
      url: '../more/about/about',
    });
  },
  // 跳轉“公告”頁
  jumpToNotice () {
    wx.navigateTo({
      url: '../notice/notice',
    });
  },
  jumpToCourse_tabBar () {
    wx.switchTab({
      url: '../category/category'
    });
  },
  
}); 
  