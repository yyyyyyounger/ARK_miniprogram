var cloudData = require('../../../data/cloud.js')
const ARK =`-ARK活動由ECE同學開創，於2020-2021年下半學期開始。目的在於幫助同學互相交流學習。
-經過一個學期，活動進展順利，參與同學都認為ARK活動很有幫助。
-我們希望這樣良好的學習氛圍能一直延續並發揚下去，並且希望活動範圍不限於2020級和ECE。
-此小程序旨在方便收集整理活動信息，也便於剛接觸本活動的同學盡早熟悉流程並參與進來。
-更多詳細信息可以點擊上方“ARK UM”查看`
let test = `未來計劃：
-----
 - 成為IET周/月常活動，**ECE、FST乃至UM傳統節目**；
 - 與CS同學合作(或自己做)，開設**專屬網站、公眾號，升級微信小程序**，提供分享資訊、公告；
  - 如有興趣參與該項目建設，~~請加WeChat: Rookie_yyyyyyang~~
 - 開設課程資料庫、功課庫、答案庫；
 - ...`;
Page({
  data: {
    today:'',
    durationDay:0,
    ARK:ARK,
    ARKLogo:cloudData.ARKLogo,
  },
  onLoad: function() {
    // 計算開發天數
    this.calcDurationDay();
    this.app = getApp();   
    let institutionNum = JSON.parse(JSON.stringify(cloudData.institutionNum));
    let institutionInfo = JSON.parse(JSON.stringify(cloudData.institutionInfo));
    this.setData({  
      institutionNum       : institutionNum,
      institutionInfo : institutionInfo,
    });

  },
  onShow: function() {
    this.setData({
      swiperAutoplay:true
    })    
  },
  onHide: function(){
    this.setData({
      swiperAutoplay:false
    })
  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },

  // 跳轉協議頁
  jumpToProtocol() {
    wx.navigateTo({
      url: '../../protocol/protocol',
    });
  },

  // 計算持續時間
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
    let durationDay = (new Date(today).getTime() - new Date('2021/04/06').getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay,
      today
    })
    console.log("The duration day is",durationDay);
  },

  // 复制的方法
  vantWeapp(){
    wx.setClipboardData({  data: 'https://vant-contrib.gitee.io/vant-weapp/#/home',  })
  },
  colorUI(){
    wx.setClipboardData({  data: 'https://github.com/weilanwl/ColorUI2',  })
  },
  oneWord(){
    wx.setClipboardData({  data: 'https://hitokoto.cn/',  })
  },
  towxml(){
    wx.setClipboardData({  data: 'https://github.com/sbfkcel/towxml',  })
  },

  // 跳轉選乜課
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
  // 跳轉合作學會頁
  toPartner(e){
    let pageNum = e.currentTarget.dataset.pagenum
    pageNum = JSON.stringify(pageNum);
    console.log(pageNum)
    wx.navigateTo({
      url: './partner/partner?pageNum=' + pageNum,
    })
  },
});
  