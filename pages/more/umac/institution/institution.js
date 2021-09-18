let app = getApp();
let localData = require('../../../../data/cloud.js');

import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

const db = wx.cloud.database();
const _ = db.command

const MAX_LIMIT = 10; //分页的大小


Page({
  data: {
    infoPageNum : 1,
    canUp : false,
    canDown : true,
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
      {
        id:5,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2021-03-06',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/0489fdef456915bb22a392c0a8907c6de1ed04e3.jpg'
        ],
      },
      {
        id:6,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2021-05-01',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/3b91e9ad43d31bde104849445f15a42309837dd3.png'
        ],
      },
      {
        id:7,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2021-09-19',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/53f8d4400369e1284729a391c9b2ab340f78e107.png'
        ],
      },
      {
        id:8,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2021-04-02',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/7de8392d8d7a3e271370b14507cb2b654335058e.png'
        ],
      },
      {
        id:9,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2021-03-20',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/2e86ac91e0a56dde75554f0f64b84bee28efe6da.png'
        ],
      },
      {
        id:10,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2020-09-20',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/e6c7278e6a3e163b4cf38e3bad2955c8da61febb.png'
        ],
      },
      {
        id:11,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2020-12-09',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/54ac3caa76042737a029c7f145885f7992692d2a.png'
        ],
      },
      {
        id:12,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2020-11-25',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/04024d925f151424ca768a0e08dc554c9c0bea93.png'
        ],
      },
      {
        id:13,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2020-09-16',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/1a3f276150ee7bf62c3e52246b97f0acf478380d.png'
        ],
      },
      {
        id:14,
        // name:'澳門工程師學會學生分部',
        shortName : 'CPSUMSU',
        date : '2020-10-17',
        // iconUrl:'https://i0.hdslb.com/bfs/album/6f74c3648370fe77421bb90b5194d19ea8aa73a9.png',
        posterUrl:['https://i0.hdslb.com/bfs/album/307fcc1627c1b161ffda5c1068b4d8c52bab8cef.png'
        ],
      },
    ],
  },

  onLoad: function (options) {
    // yyyy-mm-dd形式換算為時間戳操作
    let nowTimeStamp = Date.now();
    this.setData({  nowTimeStamp  })
    console.log('現在的時間戳',nowTimeStamp);

    Toast.loading({
      message: '等我Load一下',
      forbidClick: true,
    });
    
    // 以時間降序，獲取數據庫宣傳數據 - 未完成
    db.collection('institution') .where({
      posterUrl : _.exists(true)
    }) .orderBy('date', 'desc') .limit(MAX_LIMIT) .skip( (this.data.infoPageNum-1) * MAX_LIMIT )
    .get()
    .then(res=>{
      console.log(res.data);
      this.setData({  events : res.data  })

      if (res.data.length>0) {
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
  
        // 分開未過期活動 與 過期活動
        let overdueArr  = [];
        let comingArr   = [];
        this.data.events.map((e)=>{
          if (e.date>nowTimeStamp) {
            comingArr.push(e)
          } else {
            overdueArr.push(e)
          }
        })
        this.setData({
          overdueArr,
          comingArr,
        })
  
        // 保證wxml更新
        this.setData({
          events : this.data.events,
          canUp : this.data.infoPageNum==1 ? false : true,
          canDown : true,
        })

        Toast('點擊圖片可查看大圖！')

        if(res.data.length<MAX_LIMIT) {
          // 沒有數據了
          // this.data.infoPageNum --;
          this.setData({  canDown : false  })
        }
      }
      
    })

    if (false) {
      
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
      this.data.events.map((e)=>{
        if (e.date>nowTimeStamp) {
          comingArr.push(e)
        } else {
          overdueArr.push(e)
        }
      })
      this.setData({
        overdueArr,
        comingArr,
      })
  
      // 保證wxml更新
      this.setData({  events : this.data.events  })
    }

  },
  onShow: function () {
    
  },
  onPullDownRefresh: function () {
    app.onPullDownRefresh(this);
  },
  onReachBottom: function () {
    if (!this.data.canDown) {
      Toast('暫時收錄這麼多~')
    }
  },
  onShareAppMessage: function () {

  },
  seeImg (e) {
    let selectIndex = e.currentTarget.dataset.index;
    let selectArray = e.currentTarget.dataset.array;
    console.log('選擇了array：',selectArray,'index為',selectIndex);

    let dataArray = this.data[selectArray];
    if (dataArray[selectIndex].posterUrl[0]) {
      console.log('有Poster');
      wx.previewImage({
        urls: dataArray[selectIndex].posterUrl, // [imgUrl], //需要预览的图片http链接列表，注意是数组
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
  controlPage(e){
    let mode = e.currentTarget.dataset.mode;
    if (mode=="up") {
      this.data.infoPageNum --;
    }
    else {
      this.data.infoPageNum ++;
    }
    this.onLoad();
    wx.pageScrollTo({
      scrollTop: 0
    })
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