
Page({
  data: {
    funs:[
      {
        title:'澳大巴士報站',
        icon:'/icons/outline_directions_bus_white_24dp.png',
        color:'#dd565a',
        uri:'bus'
      },
      {
        title:'組隊約時間',
        icon:'/icons/outline_schedule_white_24dp.png',
        color:'#6d90c6',
        uri:'meet'
      },
      {
        title:'書院食堂菜單',
        icon:'/icons/outline_menu_book_white_24dp.png',
        color:'#6da14e',
        uri:'menu'
      },
      {
        title:'Deadline提醒',
        icon:'/icons/outline_pending_actions_white_24dp.png',
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
