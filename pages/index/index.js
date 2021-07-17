var app = getApp(); 
var cloudData = require('../../data/cloud.js')

Page({
  data: {
    // Vant - begin
    active_collapse: '0',
    active_col:0,
    steps: [
      {
        text: 'ECEN1005',
        desc: '2天後',
        inactiveIcon: 'location-o',
        activeIcon: 'success',
      },
      {
        text: 'ECEN1008',
        desc: '4天後',
        inactiveIcon: 'like-o',
        activeIcon: 'plus',
      },
      {
        text: 'ECEN1007',
        desc: '7天後',
        inactiveIcon: 'star-o',
        activeIcon: 'cross',
      },
      {
        text: 'CISC1000',
        desc: '半個月後',
        inactiveIcon: 'phone-o',
        activeIcon: 'fail',
      },
    ],
    show_popup:false,
    // Vant - end
    // Color - begin
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }],
    // Color - end
    moto:[],    // 一言API
    ARK_Notice:"ARK協議v1.01已發佈！點擊查看",
    isShow : false,
    projStartTime: [],
    today:'',
    durationDay:0,
  },
  onLoad: function(scene) {
    this.app = getApp();
    if (scene!="refresh") {
      this.showPopup();     // 展示頂部彈出層
      // this.getOneMoto();
      this.cloudGetOneMoto();  // 雲函數請求返回api
    }
    console.log(scene);
// 模擬向服務器請求的延時
    // this.app.toastLoadingDIY();
    wx.showShareMenu({    // 轉發按鈕所必須
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    if (app.globalData.isSignIn) {
      let isSignIn = true;
      if (cloudData.userInfoInput[10].input) {
        var isSignUp = true;
        var arkId = cloudData.userInfoInput[8].input;
      }
      this.setData({
        isSignIn,
        isSignUp,
        arkId
      })
    }
    
    this.setData({
      projStartTime : app.globalData.projStartTime[0] ,
    });
    // console.log("項目開始時間："+this.data.projStartTime.Year +'/'+ this.data.projStartTime.Month +'/'+ this.data.projStartTime.Day);
    // 計算已過日期
    this.app.calcDurationDay(this,1,'2021/06/03');
    this.onShow();
  },
  onShow (){  //頁面展示時，觸發動畫
    this.getTabBar().init();
    // this.app.sliderAnimaMode(this, 'slide_up1', -200, 1, 0, 0);
    // this.app.sliderAnimaMode(this, 'slide_up2', -200, 1, 0, 300);
    // this.app.sliderAnimaMode(this, 'slide_up3', -200, 1, 0, 600);
    // this.app.sliderAnimaMode(this, 'slide_up4', -200, 1, 0, 900);
  },
  onHide (){  //頁面隱藏時，觸發漸出動畫
    // this.app.sliderAnimaMode(this, 'slide_up1', 200, 0, 0, 0);
    // this.app.sliderAnimaMode(this, 'slide_up2', 200, 0, 0, 300);
    // this.app.sliderAnimaMode(this, 'slide_up3', 200, 0, 0, 600);
    // this.app.sliderAnimaMode(this, 'slide_up4', 200, 0, 0, 900);

    console.log("onHide() - index觸發");
  },
  onPullDownRefresh() {
    // this.getOneMoto();
    this.cloudGetOneMoto();
    this.showPopup();     // 展示頂部彈出層
    this.app.onPullDownRefresh(this);
  },
  // 監聽用戶滾動畫面動作
  onPageScroll(e) {
    // console.log(e.scrollTop);

  },
  // Vant - 頂部彈出層
  showPopup() {
    this.setData({ show_popup: true });
  },
  // Vant - 頂部彈出層
  closePopup() {
    this.setData({ show_popup: false });
  },
  // Vant - 折疊面板
  onChange(event) {
    console.log("折疊面板",event.detail);
    let detail = event.detail;
    this.setData({
      active_collapse: detail,
      active_col : detail
    });
  },
  // Vant - 豎向步驟條
  bindTapSteps(event){
    console.log("豎向步驟條",event.detail);
    let detail = event.detail+""; //num+"" 可以實現數字轉字符串
    this.setData({
      active_col : detail,
      active_collapse: detail
    })
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
  // 跳轉“所有課程”頁
  jumpToCourse_tabBar () {
    wx.switchTab({
      url: '../category/category'
    });
  },
  // 跳轉“測試”頁
  jumpToTestPage () {
    wx.navigateTo({
      url: '../test/test'
    });
  },
  // wx本地請求一言API返回 - 該方法需要開發者網站配置可信域名 - 暫未使用
  getOneMoto: function() {
    var that = this;
    wx.request({
      // url: 'https://api.xygeng.cn/one',
      url: 'https://v1.hitokoto.cn/',
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        that.setData({
          moto: res.data
        })
        console.log(that.data.moto);
      },
      fail: function(err) {console.log("獲取一言失敗");}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
    // 動態設定樣式的間距 - 未完成
  },
// http雲函數請求一言api後的返回，http雲函數應該設計為可對其寫入url - 未完成
  cloudGetOneMoto(e) {
    wx.cloud.callFunction({
      name:'http'
    }).then(res=>{
      let result = JSON.parse(res.result);
      console.log(result);
      this.setData({    moto : result  })
    }).catch(res=>{
      console.log("雲函數cloudGetOneMoto請求失敗",res);
    })
  },
// Color - 輪播
  // 獲取輪播圖 index
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  
}); 
  