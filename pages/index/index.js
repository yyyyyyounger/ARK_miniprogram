var app = getApp(); 

Page({
  data: {
    isShow : false,
    projStartTime: [],
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
    console.log("The duration day is",durationDay);
    console.log("onLoad() - index加載完成");
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  // 時間軸的icon的點擊事件
  containerTap: function() {
    let{isShow} = this.data;
    isShow =! isShow;
    this.setData({
      isShow
    })
  },

}); 
  