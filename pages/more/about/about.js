Page({
  data: {
    today:'',
    durationDay:0,
  },
  onLoad: function() {
    // this.calcDurationDay();

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

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  onTabItemTap:function(item) {

  },
  jumpToProtocol() {
    wx:wx.navigateTo({
      url: '../../protocol/protocol',
    });
  },
  calcDurationDay() {
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
  },
});
  