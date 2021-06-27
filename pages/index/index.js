var app = getApp(); 

Page({
  data: {
    isShow : false,
    projStartTime: [],
    today:'',
    durationDay:0,
  
  },
  onLoad: function() {
    this.setData({
      projStartTime : app.globalData.projStartTime
    })
    console.log("項目開始時間："+this.data.projStartTime[0].Year +'-'+ this.data.projStartTime[0].Month +'-'+ this.data.projStartTime[0].Day);

    // 獲取當前時間軸
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let today = Y+'/'+M+'/'+D;
    console.log("The today is",today);
    let durationDay = (new Date(today).getTime() - new Date('2021/06/03').getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay,
      today
    })
    console.log("The duration day is",durationDay);
    console.log("onLoad() - index加載完成");
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  // 時間軸的icon的點擊事件
  containerTap: function() {
    let{isShow} = this.data;
    isShow =! isShow;
    this.setData({
      isShow
    })
  },
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
  