let app = getApp();

import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    // 學會poster數據 - 模擬
    institutes:[
      {
        id:0,
        name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/e62ad0ad7ff6f0f1f71e1f7746dbff1bc82bf409.jpg'
        ],
      },
      {
        id:1,
        name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/71c2f3678e2497626d703e3f449e5038717f39fa.jpg'
        ],
      },
      {
        id:2,
        name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/41a51f80485e341a46f960e20c3c7c83b64ee85e.jpg'
        ],
      },
      {
        id:3,
        name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/ee84c55c45ce0bbfdb00f3b97da594ae351267a3.jpg'
        ],
      },
      {
        id:4,
        name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/428ebcf5de63655f903fe21cb4978003aa7d8116.png'
        ],
      },
    ],
  },

  onLoad: function (options) {
    // 以時間降序，獲取數據庫宣傳數據

    // 分揀已過期以及未過期宣傳
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {
    app.onPullDownRefresh(this);
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  seeImg (e) {
    let selectIndex = e.currentTarget.dataset.index;
    console.log(selectIndex);
    if (this.data.institutes[selectIndex].posterUrl[0]) {
      console.log('有Poster');
      wx.previewImage({
        urls: this.data.institutes[selectIndex].posterUrl, // [imgUrl], //需要预览的图片http链接列表，注意是数组
        // current: imgUrl, // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      console.log('尚未收錄Poster');
      Toast('暫未收錄Poster\n  晚些再來看看吧！\n    []~(￣▽￣)~*')
    }
  },
})