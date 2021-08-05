import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

var app = getApp();
var cloudData = require('../../data/cloud.js')
const db = wx.cloud.database();
const _ = db.command


Page({
  data: {
    // Vant - begin
    active_collapse: 0,
    active_col:0,
    steps: [],
    show_popup:false,
    // Vant - end
    // Color - begin
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }],
    // Color - end
    moto:[],    // 一言API
    ARK_Notice:"ARK協議v1.01已發佈！點擊查看",
    isShow : false,
    projStartTime: [],
    today:'',
    durationDay:0,
  },
  onLoad: function(scene) {
    this.app = getApp();

    // 查看開啟場景
    if (scene!="refresh") {
      this.showPopup();     // 展示頂部彈出層
      this.cloudGetOneMoto();  // 雲函數請求返回api
    }
    console.log("開啟情景為：",scene);

    // 沒有登錄則提醒
    const userCloudData = wx.getStorageSync('userCloudData')
    if (!userCloudData) {
      console.log("沒有登錄");
      Toast({
        message : '登錄後才能體驗完整功能哦！',
        zIndex  : 99999999999999
      });
    }

    wx.showShareMenu({    // 轉發按鈕所必須
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    
    // 項目開始日期
    this.setData({
      projStartTime : app.globalData.projStartTime[0] ,
    });

    // 計算開發已過日期
    this.app.calcDurationDay(this,1,'2021/06/03');
    
    // 獲取已follow的課程列表
    // 如果雲端存在近一個月的courseId，返回其簡單版的資訊（主題、時間、地點） - 未完成
    let date = new Date(Date.now());                    // 現在時刻的文字時間戳
    let today = date.toLocaleDateString();              // 今天的文本時間 yyyy/m/d
    let todayTimeStamp = (new Date(today)).getTime();   // 今天的時間戳
    console.log( "今天的時間戳：", todayTimeStamp );

    // 查詢course集合中，大於等於今天時間戳的課程，（距今一個月內未進行的課程） - 未完成
    db.collection('course').where({
        timeStampPick : _.gte(todayTimeStamp) ,
    }) .field({
        _openid : false,
        _createAt : false,
    }) .orderBy("timeStampPick","asc") .get()
    .then(res=>{
        console.log("符合條件的數據為",res.data)
        let recentCourseInfoArray = res.data;
        // 生成已經Follow了的課程Info的數組形式
        this.setData({  recentCourseInfoArray  })

        // 返回user集合中自己的follow列表
        const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
        db.collection('user').where({
          _id : userCloudDataStorage.data._openid,
        }) .field({ recentFollowCourseArray : true }) .get() .then(res=>{
          console.log("數據庫我的followCourseArray為：",res.data[0].recentFollowCourseArray);
          this.setData({  followCourseArray : res.data[0].recentFollowCourseArray  })
          
          // 向已經follow的courseId的課程信息數組上寫入haveFollow，用於wxml渲染
          for (let i = 0; i < recentCourseInfoArray.length; i++) {
            if ( !!this.data.followCourseArray ) {
              for (let j = 0; j < this.data.followCourseArray.length; j++) {
                if ( this.data.followCourseArray[j] == recentCourseInfoArray[i]._id ) {   // 對比course的最近課程和user的已follow課程
                  recentCourseInfoArray[i].haveFollow = true;
                  break
                } else {
                  console.log("沒有follow");
                  recentCourseInfoArray[i].haveFollow = false;
                }
              }
            }
            else {
              console.log("沒有follow");
              recentCourseInfoArray[i].haveFollow = false;
            }
          }
          console.log("操作已follow的數據後",recentCourseInfoArray);

          // 生成已經Follow了的課程Info的數組形式
          this.setData({  recentCourseInfoArray  })

          // 豎向步驟條設定
          this.stepsSetup();
        }) .catch(err=>{ console.error(err); })

    }) .catch(err=>{
        console.error(err);
    })

  },
  // 匹配shortName對象，單個渲染/設定時適用對象，for循環時適用數組
  findSetData() {
    // 匹配出shortName的index，生成為一個對象形式
    let shortNameIndex={};
    this.data.courseInfoInput.map(function (e, item) {    // 究極優化！本質上一行代碼匹配出所有index
      shortNameIndex[e.shortName] = e.id;
    });
    this.setData({  shortNameIndex  })
    // console.log("shortNameIndex為",shortNameIndex);

    // 匹配出shortName的display權限，生成為一個對象形式
    let shortNameDisplay={};
    this.data.courseInfoInput.map(function (e, item) {
      shortNameDisplay[e.shortName] = e.display;
    });
    this.setData({  shortNameDisplay  })
    // console.log("shortNameDisplay為",shortNameDisplay);
  },
  // 初始化各種數組
  ArrayDataInit(that) {
    // 生成 無input版 courseInfo的shortName數組
    let shortNameArray = that.data.courseInfoInput.map((item)=>{    return item.shortName   });
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = that.data.courseInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = that.data.courseInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    that.setData({    InfoDisplay, canEdit, shortNameArray    });
    // 初始化所有index值
    that.findSetData(shortNameArray);
  },

  onShow (){  //頁面展示時，觸發動畫
    this.getTabBar().init();
  },
  onHide (){  //頁面隱藏時，觸發漸出動畫
    
  },

  // 下拉刷新
  onPullDownRefresh() {
    // this.getOneMoto();
    this.cloudGetOneMoto();
    this.showPopup();     // 展示頂部彈出層
    this.app.onPullDownRefresh(this);
  },

  // Vant - 頂部彈出層
  showPopup() {
    this.setData({ show_popup: true });
  },
  // Vant - 頂部彈出層
  closePopup() {
    this.setData({ show_popup: false });
  },

  // Vant - 折疊面板
  onChange_collapse(event) {
    console.log("折疊面板",event.detail);
    let detail = event.detail;
    this.setData({
      active_collapse : detail,
      active_col      : detail
    })
  },
  // Vant - 豎向步驟條
  bindTapSteps(event){
    console.log("豎向步驟條",event.detail);
    let detail = event.detail;
    this.setData({
      active_col      : detail,
      active_collapse : detail
    })
  },
  // 豎向步驟條的數據初始化
  stepsSetup(){
    let objTemp = {};
    let stepsTemp = [];
    for (let i = 0; i < this.data.recentCourseInfoArray.length; i++) {
      if (this.data.recentCourseInfoArray[i].haveFollow) {
        objTemp = {
          text: this.data.recentCourseInfoArray[i].courseInfoInput[1].input,
          desc: '2天後',
          inactiveIcon: 'cross',
          activeIcon: 'success',
        }
        stepsTemp.push(objTemp);
      }
    }
    this.setData({  steps : stepsTemp  })
  },
  // 時間計算 - 未完成 - 輸入時間戳，返回距離該時間戳的時間（就在今天，明天，後天，2天後，3天後，，，一個星期後，兩個星期後，半個月後，一個月後）
  daysCount(begin,end){
    // begin和end皆為時間戳，計算公式由end - begin
    let diff = end - begin;
    if (diff < 24*60*60*1000) {  // 時間戳的差值在24小時內
      console.log("時間差在，今天");
    }

  },

  // wx本地請求一言API返回 - 該方法需要開發者網站配置可信域名 - 暫未使用
  getOneMoto: function() {
    var that = this;
    wx.request({
      // url: 'https://api.xygeng.cn/one',
      url: 'https://v1.hitokoto.cn/',
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        that.setData({
          moto: res.data
        })
        console.log(that.data.moto);
      },
      fail: function(err) {console.log("獲取一言失敗");}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
    // 動態設定樣式的間距 - 未完成
  },
// http雲函數請求一言api後的返回，http雲函數應該設計為可對其寫入url - 未完成
  cloudGetOneMoto(e) {
    wx.cloud.callFunction({
      name:'http'
    }).then(res=>{
      let result = JSON.parse(res.result);
      console.log(result);
      this.setData({    moto : result  })
    }).catch(res=>{
      console.log("雲函數cloudGetOneMoto請求失敗",res);
    })
  },
// Color - 輪播
  // 獲取輪播圖 index
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  // 跳轉“協議”頁
  handleTapProtocol () {
    console.log("跳轉ARK協議頁");
    wx:wx.navigateTo({
      url: '../protocol/protocol'
    });
  },
  // 跳轉“關於”頁
  jumpToAbout () {
    wx.navigateTo({
      url: '../more/about/about',
    });
  },
  // 跳轉“公告”頁
  jumpToNotice () {
    wx.navigateTo({
      url: '../notice/notice',
    });
  },
  // 跳轉課程詳情頁
  jumpToCourseDetail(e){
    console.log(e.currentTarget.dataset.courseid);
    let detailInfo = {
      user:"speaker",
      courseId:e.currentTarget.dataset.courseid,
    }
    detailInfo = JSON.stringify(detailInfo);
    wx.navigateTo({   // 帶參跳轉到指定課程詳情頁
      url: '../category/courseDetail/courseDetail?detailInfo=' + detailInfo,
    })
  },
  // 跳轉“測試”頁
  jumpToTestPage () {
    wx.navigateTo({
      url: '../test/test'
    });
  },
}); 
  