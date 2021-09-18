let app = getApp();
let localData = require('../../../../data/cloud.js');

import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    // 學會poster數據 - 模擬
    events:[
      {
        id:0,
        // name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        date : '2021-03-24',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/e62ad0ad7ff6f0f1f71e1f7746dbff1bc82bf409.jpg'
        ],
      },
      {
        id:1,
        // name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        date : '2021-05-05',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/71c2f3678e2497626d703e3f449e5038717f39fa.jpg'
        ],
      },
      {
        id:2,
        // name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        date : '2020-12-02',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/41a51f80485e341a46f960e20c3c7c83b64ee85e.jpg'
        ],
      },
      {
        id:3,
        // name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        date : '2020-10-24',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/ee84c55c45ce0bbfdb00f3b97da594ae351267a3.jpg'
        ],
      },
      {
        id:4,
        // name:'澳門工程師學會學生分部',
        shortName : 'AEMEUM',
        date : '2021-04-21',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/428ebcf5de63655f903fe21cb4978003aa7d8116.png'
        ],
      },
    ],
  },

  onLoad: function (options) {
    // 以時間降序，獲取數據庫宣傳數據 - 未完成

    // 查詢對應shortName的社團頭像url
    let institutionShortName = localData.institutionShortName;
    this.data.events.map((e)=>{
      let shortName = e.shortName;
      let shortNameIndex = institutionShortName.indexOf(shortName);
      // 如果已收錄則覆蓋頭像、名字信息
      if (shortNameIndex!=-1) {
        let institutionInfo = localData.institutionInfo[shortNameIndex]
        e.iconUrl = institutionInfo.iconSrc;
        e.name = institutionInfo.name;
      } else {
        console.log('未收錄');
      }
    })

    // yyyy-mm-dd形式換算為時間戳操作
    let nowTimeStamp = Date.now();
    this.setData({  nowTimeStamp  })
    console.log('現在的時間戳',nowTimeStamp);
    this.data.events.map((e)=>{
      let date = e.date;
      let eventTimeStamp = Date.parse( new Date(date) );
      // console.log(eventTimeStamp);
      e.date = eventTimeStamp;
    })

    // 按活動時間戳排序，降序；過期的放下面
    // 排序為時間越遠，越靠前
    function compare(p){ // 这是比较函数
      return function(m,n){
          var a = m[p];
          var b = n[p];
          return b - a; // a-b升序；b-a降序；
      }
    }
    this.data.events.sort(compare("date"));

    // 時間戳換算為yyyy-mm-yy形式
    if (false) {
      this.data.events.map((e)=>{
        let date = e.date;
        let eventTime =  new Date(date).toLocaleDateString() ;
        e.date = eventTime;
      })
    }
    console.log("排序後",this.data.events);

    // 分開未過期活動 與 過期活動
    let overdueArr  = [];
    let comingArr   = [];

    // 保證wxml更新
    this.setData({  events : this.data.events  })
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
    if (this.data.events[selectIndex].posterUrl[0]) {
      console.log('有Poster');
      wx.previewImage({
        urls: this.data.events[selectIndex].posterUrl, // [imgUrl], //需要预览的图片http链接列表，注意是数组
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
  //小贴士
  onTap_tip(){//点击后根据状态完成CSS动画显示或消失
    if(!this.data.tipsclass){
    this.setData({
      tipClass:'tipsHide',
      tipsclass:!this.data.tipsclass
     })
   setTimeout(()=>{//等待CSS动画完全结束（1s）之后再停止tips渲染
     this.setData({
       tipsNotHide:false
     });
   }, 200)
   }
   else{
     this.setData({
       tipClass:'tipsShow',
       tipsclass:!this.data.tipsclass,
       tipsNotHide:true
     })
    }
  },
  // 跳轉合作協會頁
  jumpToPartner(e){
    let selectName = e.currentTarget.dataset.shortname;
    let institutionShortName = localData.institutionShortName;
    let partnerIndex = institutionShortName.indexOf(selectName);
    if (partnerIndex!=-1) {
      console.log('合作學會已收錄，跳轉');
      let pageNum = partnerIndex;
      pageNum = JSON.stringify(partnerIndex);
      wx.navigateTo({
        url: '/pages/more/about/partner/partner?pageNum='+pageNum,
      })
    }
  },
})