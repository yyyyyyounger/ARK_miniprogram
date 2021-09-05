import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    funs:[
      {
        title:'澳大巴士報站',
        icon:'https://i.loli.net/2021/08/29/Sru1gbNFOxdQ7lv.png',
        color:'#dd565a',
        name:'bus'
      },
      {
        title:'組隊約時間',
        icon:'https://i.loli.net/2021/08/29/simU9IYnBThzR3C.png',
        color:'#6d90c6',
        name:'meet'
      },
      {
        title:'書院食堂菜單',
        icon:'https://i.loli.net/2021/08/29/lWoTjui9vF3CIEt.png',
        color:'#6da14e',
        name:'menu'
      },
      {
        title:'Deadline提醒',
        icon:'https://i.loli.net/2021/08/29/SQPC85UVoRsD3TF.png',
        color:'#d5793e',
        name:'deadline'
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

  // 跳轉巴士報站頁 - 棄用狀態
  jumpToBus(){
    wx.navigateTo({
      url: '../umac/bus/bus',
    })
  },
  // 跳轉的loading狀態
  jumpTo(e){
    let selectItem = e.currentTarget.dataset.itemname;
    if (selectItem=='bus') {
      Toast.loading('正在跳轉');
    } else {
      Toast.fail('正在開發中\n 敬請期待！');
    }
  },
});
