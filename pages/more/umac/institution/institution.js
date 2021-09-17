import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    // 學會poster數據 - 模擬
    institutes:[
      { // 滿珍
        id:0,
        rcName:'MCMC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/8_Moon-Chun-Memorial-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { // 蔡繼有
        id:1,
        rcName:'CKYC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/4_Choi-Kai-Yau-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { // 何鴻燊東亞
        id:2,
        rcName:'SHEAC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/10_Stanley-Ho-East-Asia-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { // 霍英東珍禧
        id:3,
        rcName:'HFPJC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/5_Henry-Fok-Pearl-Jubilee-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { // 曹光彪
        id:4,
        rcName:'CKPC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/1_CKPC.png',
        menuImg:[
        ],
      },
    ],
  },

  onLoad: function (options) {

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  seeMenu (e) {
    let rcName = e.currentTarget.dataset.name;
    let rcIndex = e.currentTarget.dataset.index;
    console.log(rcIndex);
    // console.log(rcName);
    if (this.data.RC[rcIndex].menuImg[0]) {
      console.log('有菜單');
      wx.previewImage({
        urls: this.data.RC[rcIndex].menuImg, // [imgUrl], //需要预览的图片http链接列表，注意是数组
        // current: imgUrl, // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      console.log('尚未收錄菜單');
      Toast('暫未收錄該書院菜單\n  晚些再來看看吧！\n    []~(￣▽￣)~*')
    }
  },
})