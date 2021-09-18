import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

var app = getApp();
var cloudData = require('../../data/cloud.js')
const db = wx.cloud.database();
const _ = db.command

let hitokotoTimer;

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
        url: 'https://i0.hdslb.com/bfs/album/0c842e4780ab9f8251a97ae09a261a0288db03b3.png'
      },
      {
        id: 1,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/83cf2b7ec7d9a873980182d9fd777f90112eada9.png'
      },
      {
        id: 2,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/4ef0bfd4d4177573eb0ff9935024f77675d1f4be.png'
      },
      {
        id: 3,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/6bf877ab5fe7ae81171472f87e72ccc9254e8ead.png'
      },
      {
        id: 4,
          type: 'image',
          url: 'https://i0.hdslb.com/bfs/album/5e84ac5924085d3155846926da3f32c18bbb2049.jpg',
      },
      {
        id: 5,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/dec826ae3cddacd1c4328a208fd7a2d64e8b878d.jpg'
      },       
      {
        id: 6,
        type: 'image',
        url: 'https://i0.hdslb.com/bfs/album/e9ca52265e0d70005509621a20ce5ed28cba8ccc.png'
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
      id:7,
      question: 'Q0:這個小程序是什麼？',
      answer: 'ARK小程式既作為FST ARK活動運作平台(可查看頂部協議)，也在開發其他契合澳大生活的功能，爭取實現UM All In One~ 成為普及全澳大的效率工具~'
    },
    {
      id:8,
      question: 'Q0.1:這個小程序能做什麼？',
      answer: '眾所周知知識不只存在於書上，你可以在這裡分享任何你認為有價值的東西，也可以從其他同學那裡獲取相對應的資源！只要遵守ARK協議！不久的未來將提供一連串的澳大校園應用，敬請期待，可以前往更多頁-小功能查看~'
    },
    {
      id:0,
      question: 'Q1:如何Follow課程',
      answer: '點擊下方“課程”按鈕，找到喜歡的課程進行Follow吧~'
    },
    {
      id:1,
      question: 'Q2:在哪裡查看Follow的課程',
      answer: '“首頁”，“課程”的“我的Follow”中均有記錄哦~'
    },
    {
      id:2,
      question: 'Q3:如何取消Follow',
      answer: '在“我的Follow”中點擊“ByeBye”按鈕即可~'
    },
    {
      id:3,
      question: 'Q4:如何收到通知',
      answer: '開課成功、臨近課程時，我們將通過微信 - “服務通知”提醒您，所以請同意接受訂閱並勾選不再詢問！如點擊了不再詢問且取消訂閱，則可以前往更多頁“權限設置”裡修改訂閱權限。ps：因為小程序的有什麼大病的訂閱邏輯，只能採用這種靜默獲取訂閱權限的方式，但只有在關注的課程開始前半小時才會觸發！'
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
    buttonArr : [
      {
        name  : '新增\nARK',
        shortName  : 'newARK',
        path  : '',
        color:'#3498DB',
      },
      {
        name  : '最近\nARK',
        shortName  : 'recentARK',
        path  : '',
        color:'#3498DB',
      },
      {
        name  : '巴士\n報站',
        shortName  : 'bus',
        path  : '',
        color:'#4ba4df',
      },
      {
        name  : '書院\n菜單',
        shortName  : 'rcMenu',
        path  : '',
        color:'#4ba4df',
      },
      {
        name  : '合作\n學會',
        shortName  : 'partner',
        path  : '',
        color:'#64b1e3',
      },
      {
        name  : '更多\n功能',
        shortName  : 'more',
        path  : '',
        color:'#64b1e3',
      },
    ],
  },
  onLoad: function(scene) {
    this.app = getApp();

    // 小船动画初始化
    this.setData({
      shipClass : 'shipAnim0'
    })

    // 非下拉刷新的場景時 - 首次加載
    if (scene!="refresh") {
      this.showPopup();     // 展示頂部彈出層
      // this.cloudGetOneMoto();  // 雲函數請求返回api
      // this.hitokotoLocal();
      // 5s後關閉彈出層
      // setTimeout(() => {
        // this.closePopup()  //關閉彈出層
      // }, 5000)
      this.setData({//主頁公告 在cloudData裡
        indexAnnouncement:cloudData.indexAnnouncement
      })
    }

    // 沒有登錄則提醒
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    if (!userCloudDataStorage) {
      Toast({
        message : '登錄後才能體驗完整功能哦！',
        zIndex  : 99999999999999
      })
    } else {  // 已登錄，存放userCloudData
      this.setData({  userCloudData : userCloudDataStorage.data  })
      Toast({
        message : '\t歡迎回來！\t\n   第 '+userCloudDataStorage.data.arkid+' 位 ARKer！\n\t[]~(￣▽￣)~*',
        zIndex  : 99999999999999
      })
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
    this.app.calcDurationDay(this,1,'2021/04/06');
    
    // 獲取已follow的課程列表 - 棄用狀態
    // this.returnMyFollowCourses();

    // 轉發按鈕所必須
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    this.hitokotoLocal();
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

        if (!!recentFollowIdArray) {  // 如果有follow的課程
          // 獲取courseId對應的課程，只返回15日內的課
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
            let recentCourseInfoArray = res.data;
            console.log("我follow的課程的信息為：",recentCourseInfoArray);
            // 將過長的課程名整成省略號
            recentCourseInfoArray.map((e)=>{
              if (e.courseInfoInput[1].input.length>7) {
                console.log(e.courseInfoInput[1].input,"需截取");
                e.courseInfoInput[1].input = e.courseInfoInput[1].input.substring(0,7) + '...'
              }
            })
            this.setData({  recentCourseInfoArray  })

            // 豎向步驟條設定
            this.stepsSetup();
            // 加載完成提示
            this.toastNotice();
          })
        } else{
          // 加載完成提示
          this.toastNotice();
        }

      }) .catch(err=>{ console.error(err); })
    } else {
      // 加載完成提示
      this.toastNotice();
    }

  },
  // 加載完成提示
  toastNotice(){
    Toast('  加載完成！\n下拉可刷新！\n[]~(￣▽￣)~*');
  },

  onShow (){  //頁面展示時，觸發動畫
    this.getTabBar().init();
    this.setData({
      showQandA:false,
    })
  },
  onHide (){
    clearInterval(hitokotoTimer);
  },
  onUnload(){
    clearInterval(hitokotoTimer);
  },

  // 下拉刷新
  onPullDownRefresh() {
    // this.cloudGetOneMoto();
    this.hitokotoLocal();
    if (!this.data.userCloudData) {
      this.showPopup();     // 展示頂部彈出層
    }
    this.app.onPullDownRefresh(this);
    this.setData({
      showQandA:false
    })
  },

  // Vant - 打開頂部彈出層
  showPopup() {
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    // 沒有登錄的用戶則展示彈出層，展示ARK協議
    if (!userCloudDataStorage) {
      this.setData({ show_popup: true });
    }
  },
  // Vant - 關閉頂部彈出層
  closePopup() {
    this.setData({ show_popup: false });
    Toast({
      message : '下拉刷新可重新獲取彈出層內容！',
      zIndex  : 99999999999999
    })
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
        inactiveIcon: 'underway',
        activeIcon: 'checked',
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
        logMes="講完了~";
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
// 本地請求一言api
  hitokotoLocal(e) {
    let that = this;
    wx.request({
      url: 'https://v1.hitokoto.cn?c=d&c=h&c=i&c=k&c=l',
      success(res){
        // console.\log(res.data);
        that.setData({    moto : res.data  })
        hitokotoTimer = setTimeout(() => {
          that.hitokotoLocal();
        }, 10000);
      },
      fail(err){
        console.log("本地一言請求失敗",res);
      }
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
  // 跳轉“更多”頁
  jumpToMore () {
    wx.switchTab({
      url: '../more/more',
    })
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
  // 主頁快捷按鈕跳轉
  indexButtonJump (e) {
    let clickItem = e.currentTarget.dataset.name;
    console.log("用戶點擊",clickItem,'按鈕');
    switch (clickItem) {
      case 'newARK':
        // 使用app.global數據協助跳轉，0 1 2 3對應課程頁tabs的索引
        app.globalData.switchTabs = 3;
        wx.switchTab({
          url: '/pages/category/category',
        })
        break;
    
      case 'recentARK':
        wx.switchTab({
          url: '/pages/category/category',
        })
        break;
    
      case 'bus':
        wx.navigateTo({
          url: '/pages/more/umac/bus/bus',
        })
        break;
    
      // case 'rcMenu':
      //   wx.navigateTo({
      //     url: '/pages/more/umac/rcMenu/rcMenu',
      //   })
      //   break;
    
      case 'partner':
        // let pageNum = 0;
        // pageNum = JSON.stringify(pageNum);
        // wx.navigateTo({
        //   url: '/pages/more/about/partner/partner?pageNum='+pageNum,
        // })
        wx.navigateTo({
          url: '/pages/more/umac/institution/institution',
        })
        break;
    
      // case 'more':
      //   wx.switchTab({
      //     url: '/pages/more/more',
      //   })
      //   break;
    
      default:
        break;
    }
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
  
  // 點按ARK介紹，小船翻轉後，跳轉
  shipTouched(){
    // 翻轉動畫
    this.shipRoll();
    
    setTimeout(()=>{
      this.jumpToAbout();
    }, 500)
  },
  // 小船翻转后重新载入 小船摇曳动画
  shipRoll(){
    Toast('上 船 ！')
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
  