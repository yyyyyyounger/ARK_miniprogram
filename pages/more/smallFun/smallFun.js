
Page({
  data: {
    funs:[
      {
        title:'澳大巴士報站',
        icon:'https://i.loli.net/2021/08/29/Sru1gbNFOxdQ7lv.png',
        color:'#dd565a',
        uri:'bus'
      },
      {
        title:'組隊約時間',
        icon:'https://i.loli.net/2021/08/29/simU9IYnBThzR3C.png',
        color:'#6d90c6',
        uri:'meet'
      },
      {
        title:'書院食堂菜單',
        icon:'https://i.loli.net/2021/08/29/lWoTjui9vF3CIEt.png',
        color:'#6da14e',
        uri:'menu'
      },
      {
        title:'Deadline提醒',
        icon:'https://i.loli.net/2021/08/29/SQPC85UVoRsD3TF.png',
        color:'#d5793e',
        uri:'deadline'
      },
    ]
  },
  onLoad: function() {

  },
  onShow: function() {
  },
  onPullDownRefresh: function() {

  },
  onShareAppMessage: function() {

  },

  // 跳轉巴士報站頁
  jumpToBus(){
    wx.navigateTo({
      url: '../umac/bus/bus',
    })
  },
});
