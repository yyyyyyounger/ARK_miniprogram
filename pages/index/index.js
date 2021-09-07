import { ARKVersion } from '../../data/cloud.js';
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
    // 輪播圖
    cardCur: 0,
    swiperList: [
      {
        id: 0,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/dec826ae3cddacd1c4328a208fd7a2d64e8b878d.jpg'
      }, 
      {
        id: 1,
          type: 'image',
          url: 'https://i0.hdslb.com/bfs/album/5e84ac5924085d3155846926da3f32c18bbb2049.jpg',
      }, 
      {
        id: 2,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/5b6a070c62297faf3cf6fd304f5a61b8e944d49c.jpg'
      },
      {
        id: 3,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/2fe21e078b9bfc16ae6627ef3cb5afe37ffcc987.png'
      },
      {
        id: 4,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/57c90fcd1e3ac67a42f496e52f2c20e5bf49de13.jpg'
      },
      {
        id: 5,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/51979c04c6d6eaa7ae0b917cce9053596863ead4.jpg'
      },
      {
        id: 6,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/4155c2b9eeff4a6f90c4f219f83810b6f51aae2e.jpg'
      },
    ],
    // Color - end
    moto:[],    // 一言API
    isShow : false,
    projStartTime: [],
    today:'',
    durationDay:0,
    // 課程渲染相關
    followCourseArray:[],
    //Q&A循環渲染数组
    QandAlist:[
    {
      id:0,
      question: 'Q1:如何Follow課程',
      answer: '點擊下方“課程”按鈕，找到喜歡的課程進行Follow吧'
    },
    {
      id:1,
      question: 'Q2:在哪裡查看Follow的課程',
      answer: '“首頁”，“課程”的“我的Follow”中均有記錄哦'
    },
    {
      id:2,
      question: 'Q3:如何取消Follow',
      answer: '在“我的Follow”中點擊“ByeBye”按鈕即可'
    },
    {
      id:3,
      question: 'Q4:如何收到通知',
      answer: '開課成功、預約成功、臨近課程時，我們將通過您的學校郵箱通知您，所以請務必正確填寫UM ID'
    },
    {
      id:4,
      question: 'Q5:如何開課',
      answer: '在“課程”頁中找到“我要開課按鈕”，查看須知後開課'
    },
    {
      id:5,
      question: '更多...',
      answer: '小程序還有許多附加功能，盡情探索吧！特別是“更多”頁！'
    },
    {
      id:6,
      question: '有BUG！',
      answer: '小程序仍在測試階段，有任何BUG請在“更多”頁中的“反饋”中查看上報方法！'
    },
    ],
    showQandA:false,
  },
  onLoad: function(scene) {
    this.app = getApp();
    this.setData({//小船动画初始化
      shipClass:'shipAnim0'
    })
    var shipClass = this.data.shipClass

    // 非下拉刷新的場景時 - 首次加載
    if (scene!="refresh") {
      // this.showPopup();     // 展示頂部彈出層
      this.cloudGetOneMoto();  // 雲函數請求返回api
      // 5s後關閉彈出層 - 彈出層棄用狀態，可以用來賣廣告笑
      // setTimeout(() => {
      //   this.closePopup()  //關閉彈出層
      //   Toast({
      //     message : '下拉刷新可重新獲取彈出層內容！',
      //     zIndex  : 99999999999999
      //   })
      // }, 5000)
      this.setData({//主頁公告 在cloudData裡
        indexAnnouncement:cloudData.indexAnnouncement
      })
    }

    // 轉發按鈕所必須
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    // 沒有登錄則提醒
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    if (!userCloudDataStorage) {
      Toast({
        message : '登錄後才能體驗完整功能哦！',
        zIndex  : 99999999999999
      })
    } else {  // 存放userCloudData
      this.setData({  userCloudData : userCloudDataStorage.data  })
    }
    // 查詢該用戶的管理員權限，是管理員則返回checkingCourseList
    if (userCloudDataStorage) {
      this.setData({  admin : userCloudDataStorage.data.admin  })
      if (this.data.admin) {  // 管理員權限者 - 返回課程列表中courseState為checking的課
        db.collection('course').where({
          timeStampPick : _.gte(Date.now()-15*24*60*60*1000) ,   // 半個月前到未來期間的仍是checking狀態的課程
          courseState : _.eq("checking") ,
        }) .field({
            _openid : false,
            _createAt : false,
        }) .orderBy("timeStampPick","asc") .get() .then(res=>{
          console.log("課程狀態為checking的課為",res.data);
          this.setData({  checkingCourseList : res.data  })
        })
      }
    }

    // 設定項目開始日期 & 當前時刻的時間戳
    this.setData({
      projStartTime : app.globalData.projStartTime[0] ,
      nowTimeStamp  : Date.now() ,
    })
    // 計算開發已過日期
    this.app.calcDurationDay(this,1,'2021/06/03');
    
    // 獲取已follow的課程列表
    this.returnMyFollowCourses();
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
  // 返回user集合中自己的follow課程信息
  returnMyFollowCourses() {
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
    if (userCloudDataStorage) {   // 登錄才操作 - 緩存存在才操作
      db.collection('user').where({
        _id : userCloudDataStorage.data._openid,
      }) .field({ recentFollowIdArray : true }) .get() 
      .then(res=>{
        let recentFollowIdArray = res.data[0].recentFollowIdArray;
        console.log("數據庫我的followCourseArray為：",recentFollowIdArray);
        if (!!recentFollowIdArray) {
          this.setData({  recentFollowIdArray  })

          // 有follow則獲取courseId對應的課程
          db.collection('course').where({
            timeStampPick : _.gte(this.data.nowTimeStamp-15*24*60*60*1000) ,
            _id           : _.in(recentFollowIdArray) ,
          }) .field({
              _openid   : false,
              _createAt : false,
              allowVote : false,
              arkid     : false,
              avatarUrl : false,
              followMember : false,
              memberLimit  : false,
              nickName  : false,
          }) .orderBy("timeStampPick","asc") .get()
          .then(res=>{
            console.log("我follow的課程的信息為：",res.data);
            this.setData({  recentCourseInfoArray : res.data  })

            // 豎向步驟條設定
            this.stepsSetup();
            Toast('  加載完成！\n下拉可刷新！');
          })
        } else{
          Toast('  加載完成！\n下拉可刷新！');
        }

      }) .catch(err=>{ console.error(err); })
    } else {
      Toast('  加載完成！\n下拉可刷新！');
    }

  },

  onShow (){  //頁面展示時，觸發動畫
    this.getTabBar().init();
    this.setData({
      showQandA:false,
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.cloudGetOneMoto();
    // this.showPopup();     // 展示頂部彈出層
    this.app.onPullDownRefresh(this);
    this.setData({
      showQandA:false
    })
  },

  // Vant - 打開頂部彈出層
  showPopup() {
    this.setData({ show_popup: true });
  },
  // Vant - 關閉頂部彈出層
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
  // 管理員的checking課列表
  onChange_collapse_check(event) {
    let detail = event.detail;
    this.setData({
      active_collapse_check : detail,
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
      objTemp = {
        text: this.data.recentCourseInfoArray[i].courseInfoInput[1].input,
        desc: this.checkDate(this.data.recentCourseInfoArray[i].timeStampPick),
        inactiveIcon: 'cross',
        activeIcon: 'success',
      }
      stepsTemp.push(objTemp);
    }
    this.setData({  steps : stepsTemp  })
  },
  // 時間計算 - 輸入end_date時間戳，返回今天距離該時間戳的時間（就在今天，明天，後天，2天後，3天後，，，一個星期後，兩個星期後，半個月後，一個月後）
  checkDate: function(end_date) {
    let logMes="";
    let nowTime = new Date().getTime();
    if (end_date < nowTime) {   // 已經結束
        logMes="已經結束";
        return logMes;
    }
    let tempTime = 1628179200000;
    //转成毫秒数，两个日期相减
    let end_ms = end_date - tempTime;
    let start_ms = nowTime - tempTime;
    let day = parseInt(end_ms / (1000 * 60 * 60 * 24))-parseInt(start_ms / (1000 * 60 * 60 * 24));
    switch(day){
        case 0:
            logMes="就在今天";
        break;
        case 1:
            logMes="明天舉行";
        break;
        case 2:
            logMes="後天舉行";
        break;
        case 3:
            logMes="兩天後舉行";
        break;
    } 
    if (day>3 && day<=7)            logMes="三天後";
    else if (day > 7 && day <=15)   logMes="一週後";
    else if (day > 15 )             logMes="半個月後";
    else if (day > 30)              logMes="一個月後";
    return logMes
  },

// http雲函數請求一言api後的返回，http雲函數應該設計為可對其寫入url - 未完成
  cloudGetOneMoto(e) {
    wx.cloud.callFunction({
      name:'http'
    }).then(res=>{
      let result = JSON.parse(res.result);
      // console.log(result);
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
  handleTapAnnouncement () {
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
  // 圖片預覽
  clickImg: function(e){
    let selectId = e.currentTarget.dataset.id;
    let imgUrl = this.data.swiperList[selectId].url;
    let imgUrlArr = this.data.swiperList.map((e)=>{
      return e.url
    })
    wx.previewImage({
      urls: imgUrlArr, // [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: imgUrl, // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //Q&A收放
  displayQandA(){
    this.setData({
      showQandA:!this.data.showQandA
    })
  },
  
  // 點按小船，觸發翻转动画
  shipTouched(){
    // 翻轉動畫
    this.shipRoll();
    
    setTimeout(()=>{
      this.jumpToAbout();
    }, 500)
  },
  // 小船翻转后重新载入 小船摇曳动画
  shipRoll(){
    // 小船翻轉
    this.setData({
      shipClass:'shipRoll',
    })
    // 延遲500ms，恢復默認狀態
    setTimeout(()=>{
      this.setData({
        shipClass:'shipAnim1'
      })
    }, 500)
  }
}); 
  