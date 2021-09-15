import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    RC:[
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
      { // 呂志和
        id:5,
        rcName:'LCWC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/6_Lui-Che-Woo-College_square-1024x1024.png',
        menuImg:[
          'https://mmbiz.qpic.cn/mmbiz_png/uV4x4Ln1IIicibxZt2j1YbAtZcpM8EZQ4cicqkqreKSriaRyGsAo2rjbhGiadgGXjDod0ISHvY1GicV9UUrMKaCGQWBw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1',
        ],
      },
      { // 鄭裕彤
        id:6,
        rcName:'CYTC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/2_Cheng-Yu-Tung-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { // 馬萬祺
        id:7,
        rcName:'MLC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/7_Ma-Man-Kei-and-Lo-Pak-Sam-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { // 張崑崙
        id:8,
        rcName:'CKLC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/3_Cheong-Kun-Lun-College_square-1024x1024.png',
        menuImg:[
        ],
      },
      { //  紹邦
        id:9,
        rcName:'SPC',
        rcIcon:'https://www.um.edu.mo/wp-content/uploads/2020/09/9_Shiu-Pong-College_square-1024x1024.png',
        menuImg:[
        ],
      },
    ]
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