var app = getApp();

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

var towxml = app.require('/towxml/index');
var cloudData = require('../../data/cloud.js')
const db = wx.cloud.database();
const _ = db.command

// tabs狀態，默認點擊第0個tabs
let clickTabs = 0;

// 開課欄目的教程 - Markdown語法
let notification = `
**開課按鈕在本頁下方！**
課程狀態分類：
&nbsp; **·** 審核中 '**checking**'
&nbsp; **·** 開放follow中 '**opening**'
&nbsp; **·** 已結束課程 '**finish**'

&nbsp; **·** 審核通過後可以再修改某些信息，修改權限可以與管理員協商。
&nbsp; **·** 設定的Helper不算入任何參與/主持次數，需自行follow課程。
&nbsp; **·** opening狀態課程可以上傳文件（從微信聊天選取，可以先傳送到聊天再到小程式上傳文件），當前版本不支持電腦版ARK上傳文件。
&nbsp; **·** 到開始時間後會開啟簽到，簽到完成的follower才可以查看上傳的文件。
&nbsp; **·** 需要自行預約房間，圖書館可以使用三張學生卡提前預約。

如有特別情況或錯誤，請前往**更多頁**聯繫管理員！`;
let process = `
1 . 點擊“我要開課”，填寫必填或選填信息
2 . 確認無誤後提交審核
3 . 等待審核通過
4 . 通過後仍可修改部分信息
5 . 在預定的時間舉辦課程並指揮同學簽到
6 . 課程結束後點擊結課按鈕（課程詳情頁中）
7 . 一次ARK完整結束！✿✿ヽ(°▽°)ノ✿`;

Page({
  data: {
    // 默認tabs打開頁
    // tabs_active:0,
    //小贴士
    tipsNotHide:false,
    tipsclass:true,
    // 頁面加載狀態
    loading : true,
    // 下拉菜單
    option1: [
      { text: '按日期排序', value: 0 },
      { text: '按字母排序', value: 1 },
    ],
    option2: [
      { text: 'A ~ Z', value: 0 },
      { text: 'Z ~ A', value: 1 },
    ],
    option3: [
      { text: '最近', value: 0 },
      { text: '最遠', value: 1 },
    ],
    dropDownIndex: 0,

    // 課程渲染相關
    followCourseArray:[],
  },
  onLoad (options,page) {
    this.setData({
      tipClass:'tipsHide'
    })
    this.app = getApp();
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    this.setData({  userCloudDataStorage : userCloudDataStorage.data,  })

    //开课须知 和 流程说明的Markdown渲染
    this.setData({
      notificationMD  : towxml(notification,'markdown'),
      processMD       : towxml(process,'markdown'),
    })

    // 返回最近課程信息 - 在onShow()操作

    if (userCloudDataStorage) { // 如果已登錄，獲取admin權限
      this.setData({  admin : userCloudDataStorage.data.admin  })

      const subscribeState = wx.getStorageSync('subscribeState');
      if (!subscribeState) {
        app.checkSubscribe();
      }
    }
  },
  onShow () {
    this.setData({  tabs_active : 0  })
    // 設定跳轉的tabs
    if (!!app.globalData.switchTabs) {    // 有設定跳轉參數
      this.setData({  tabs_active : app.globalData.switchTabs  })
      app.globalData.switchTabs = 0;      // 復位
    }

    if (clickTabs==0 || clickTabs==1) {   // 課程頁面
      // 向服務器請求的延時
      Toast.loading({
        message: '瘋狂加載中...',
        forbidClick: true,
        // zIndex: 9999999999999,
        duration : 0,
      })

      // 返回最近課程信息
      this.courseInfoInit();
    }
    
    // 設置當前時間
    this.setData({  nowTimeStamp : Date.now()  })

    // 初始化tabs？不知道有沒有用
    this.getTabBar().init();

  },
  onPullDownRefresh: function() {
    if ( clickTabs==0 || clickTabs==1 ) { // 不需要刷新的分欄
      // 設定至加載狀態 - 骨架屏
      this.setData({  loading : true  })
    }

    Toast.loading({
      message: '拼命加載中...',
      forbidClick: true,
      duration : 0,
    })
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);

    if ( clickTabs==2 || clickTabs==3 ) { // 不需要刷新的分欄
      Toast('這個分欄不需要刷新呢\n           (✺ω✺)')
    }
    else {                                // 課程查看分欄，獲取課程信息
      this.onShow();
    }

  },

  // 返回最近課程信息
  courseInfoInit() {
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    // 查詢course集合中，符合條件的課程 - 未完成
    db.collection('course') .where( _.or([
      { // 路人/普通用戶可查看最近已opening的課程，和半年（182.5天）前已經finish的課程
        timeStampPick : _.gte(Date.now()-182.5*24*60*60*1000) ,
        courseState   : _.eq('opening').or(_.eq('finish')) ,
      },
      { // 已開課的用戶可查看近期自己仍在checking，opening，finish的課程
        timeStampPick : _.gte(Date.now()-182.5*24*60*60*1000) ,    // 半個月前到未來期間的仍是checking，opening，finish狀態的課程
        courseState   : _.eq('checking').or(_.eq('opening')).or(_.eq('finish')) ,
        arkid         : _.eq(userCloudDataStorage ? userCloudDataStorage.data.arkid : 0) , // 自己的開課
      },
      { // 添加管理員查看checking權限
        timeStampPick : _.gte(Date.now()-182.5*24*60*60*1000) ,    // 半個月前到未來期間的仍是checking，opening，finish狀態的課程
        courseState   : _.eq(userCloudDataStorage ? (userCloudDataStorage.data.admin ? 'checking' : 0) : 0) ,
      },
    ]) ) .field({
        _openid : false,
        _createAt : false,
    }) .orderBy("timeStampPick","asc") .get()
    .then(res=>{
        console.log("符合條件的最近的課為",res.data)
        let recentCourseInfoArray = res.data;

        // 排序為時間越遠，越靠前
        function compare(p){ // 这是比较函数
          return function(m,n){
              var a = m[p];
              var b = n[p];
              return b - a; // a-b升序；b-a降序；
          }
        }
        recentCourseInfoArray.sort(compare("timeStampPick"));
        console.log("排序後",recentCourseInfoArray); 

        // 將finish課程置底
        let openCourse    = [];
        let finishCourse  = [];
        // 分解finish課程和open課程
        recentCourseInfoArray.map((e,index)=>{
          if (e.courseState=='finish') {
            console.log("已結束課程：",index,e);
            finishCourse.push(e)
          } else {
            openCourse.push(e)
          }
        })
        // 如果存在已結束課程，插入opening課程的最後
        if (finishCourse[0]) {
          finishCourse.map((e)=>{
            openCourse.push(e)
          })
        }
        recentCourseInfoArray = openCourse;

        // 生成已經Follow了的課程Info的數組形式
        this.setData({  recentCourseInfoArray  })

        if (userCloudDataStorage) {
          // 返回user集合中自己的follow列表
          db.collection('user').doc(userCloudDataStorage.data._openid) .field({
            recentFollowIdArray : true
          }) .get() .then(res=>{
            console.log("我的數據庫followCourseArray為：",res.data.recentFollowIdArray);
            this.setData({  followCourseArray : res.data.recentFollowIdArray  })
            
            if (this.data.followCourseArray) {
              // 生成只有最近的課的課程id數組
              let recentCourseIdRecordArr = {};
              this.data.recentCourseInfoArray.map(function (e, index, item) {
                recentCourseIdRecordArr[e._id] = index;
              });
              this.setData({  recentCourseIdRecordArr  })
              console.log("最近的課的課程id數組為",recentCourseIdRecordArr);    // 數組的索引為最近課程的id，該位元素為最近課程info的索引
              for (let i = 0; i < this.data.followCourseArray.length; i++) {
                console.log("最近follow的course",this.data.followCourseArray[i]," ，對應的recentIndex為",recentCourseIdRecordArr[this.data.followCourseArray[i]]);
              }
            }

            // // 向已經follow的courseId的課程信息數組上寫入haveFollow，用於wxml渲染
            for (let i = 0; i < recentCourseInfoArray.length; i++) {
              if ( !!this.data.followCourseArray ) {    // 如果用戶自己有follow記錄才操作
                for (let j = 0; j < this.data.followCourseArray.length; j++) {
                  if ( this.data.followCourseArray[j] == recentCourseInfoArray[i]._id ) {   // 如果user已follow某課程，則haveFollow寫入false
                    recentCourseInfoArray[i].haveFollow = true;
                    break     // 把 j 的for循環break掉
                  } else {    // haveFollow寫入false
                    recentCourseInfoArray[i].haveFollow = false;
                  }
                }
              }
              else {          // 沒有follow記錄，則所有最近課程的haveFollow都寫入false
                recentCourseInfoArray[i].haveFollow = false;
              }
            }
            console.log("對infoArray寫入haveFollow數據後",recentCourseInfoArray);
            // 交由wxml渲染
            this.setData({  recentCourseInfoArray  })

            this.toastNotice();

            // 結束loading狀態
            this.setData({  loading : false  })

          }) .catch(err=>{ console.error(err); })
        }
        else {
          // 結束loading狀態
          this.setData({  loading : false  })
          this.toastNotice();
        }

    }) .catch(err=>{  console.error(err);  })
  },
  // 加載完成提示
  toastNotice(){
    Toast('  加載完成！\n下拉可刷新！\n[]~(￣▽￣)~*');
  },

  // 頂部tabs的點擊切換事件 - 不同tabs時執行不同，節省資源，未完成
  onClick_tabs(e) {
    // tabs由0開始
    clickTabs = e.detail.name;
    switch (e.detail.name) {
      case 0:   // 最近發佈
        
        break;
    
      case 1:   // 我的follow
        
        break;
        
      case 2:   // 歸檔記錄
        
        break;
    
      case 3:   // 我要開課
        
        break;
    }
  },

  // 下拉菜單 - 棄用狀態 - 等待拯救
  dropDownChange(e) {
    console.log(e);
    this.setData({
      dropDownIndex : e.detail
    })
  },

  onConfirm() {
    this.selectComponent('#item').toggle();
  },

  // 添加follow的課程
  addFollow (e) {
    const userCloudDataStorage = wx.getStorageSync('userCloudData');
    if (userCloudDataStorage) {    // 已登錄才可以操作
      Dialog.confirm({
        title: '操作提示',
        message: '自己follow的課要好好上完喔！😎',
        zIndex:99999999,
      })
      .then(res=>{            // on confirm
        app.checkSubscribe();
        // 加載提示
        Toast.loading({
          message: '拼命加載中...',
          forbidClick: true,
        });
        // 正常應該只能follow 20節課，獲取資料的時候默認20條記錄限制 - 好像沒有寫
        
        let selectCourse = e.currentTarget.dataset.courseid;  // 記錄Follow的課程id
        let arrindex = e.currentTarget.dataset.arrindex;
        console.log("請求add",selectCourse);
        console.log("arrindex為",arrindex);
    
        // 雲函數更新 - user集合 - recentFollowIdArray數組
        const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
        // 權限問題需要調用雲函數
        // user基本信息導入到該courseId的followMember數組內
        wx.cloud.callFunction({ 
          name : 'courseFollowMember',
          data : {
            mode          : "add",
            selectCourse  : selectCourse,
            endTimeStamp  : this.data.recentCourseInfoArray[arrindex].timeStampPick,
            arkid         : userCloudDataStorage.data.arkid,
            avatarUrl     : userCloudDataStorage.data.avatarUrl,
            name          : userCloudDataStorage.data.userInfoInput[1].input,
          }
        }) .then(res=>{         // 寫入自己的follow列表
          db.collection('user').doc(userCloudDataStorage.data._openid).update({
            data: {
              recentFollowIdArray: _.push([selectCourse]),
            }
          }) .then(res=>{       // 成功提示 & 同步wxml的顯示
            Toast('Follow成功！課程編號：'+selectCourse+'\n可前往 “我的Follow” 查看');
            // 同步wxml的顯示
            for (let i = 0; i < this.data.recentCourseInfoArray.length; i++) {
              if (this.data.recentCourseInfoArray[i]._id == selectCourse) {
                this.setData({  ['recentCourseInfoArray['+i+'].haveFollow'] : true  })    
              }
            }
          })
        }) .catch(err=>{        // 失敗提示
          console.error(err);
          Notify({ type: 'warning', message: '操作失敗！請刷新頁面或聯繫管理員！' });
        })
        
        // 詢問是否同意微信訂閱 開課消息
      })                      // on confirm - end
      .catch(res=>{           // on cancel
      })
    }
    else {                  // 未登錄提示登錄
      Dialog.confirm({
        title: '操作提示',
        message: '該功能需要登錄後操作！\n現在去登錄嗎？',
        zIndex:99999999,
      })
      .then(() => {   // on confirm
        wx.switchTab({
          url: '../user/user',
        })
      })
      .catch(() => {  // on cancel
        
      });
    }
  },
  // 刪除follow的課程
  deleteFollow(e){
    // 防誤觸式提問
    Dialog.confirm({
      title: '重要提示',
      message: '就這麼忍心說ByeBye嗎？😭',
      zIndex:99999999,
    })
    .then(() => {     // on confirm
      Toast.loading({   // 加載提示
        message: '拼命加載中...',
        forbidClick: true,
      });

      // 記錄Follow的課程id
      let selectCourse = e.currentTarget.dataset.courseid;
      let arrindex = e.currentTarget.dataset.arrindex;
      console.log("請求delete",selectCourse);

      // 調用雲函數更新 - user集合 - recentFollowIdArray數組
      const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
      wx.cloud.callFunction({   // 刪除followMember數組內該user的arkid等數據
        name : 'courseFollowMember',
        data : {
          mode          : "delete",
          endTimeStamp  : this.data.recentCourseInfoArray[arrindex].timeStampPick,
          selectCourse  : selectCourse,
          arkid         : userCloudDataStorage.data.arkid,
        }
      }) .then(res=>{           // 刪除自己的follow列表
        db.collection('user').doc(userCloudDataStorage.data._openid).update({
          data: {
            recentFollowIdArray: _.pull(_.in([selectCourse]))
          }
        }) .then(res=>{         // 成功提示 & 同步wxml的顯示
          Toast('刪除成功！');
          // 同步wxml的顯示
          for (let i = 0; i < this.data.recentCourseInfoArray.length; i++) {
            if (this.data.recentCourseInfoArray[i]._id == selectCourse) {
              this.setData({  ['recentCourseInfoArray['+i+'].haveFollow'] : false  })
            }
          }
        }) .catch(err=>{ console.error(err); })
      }) .catch(err=>{             // 失敗提示
        console.error(err);
        Notify({ type: 'warning', message: '操作失敗！請刷新頁面或聯繫管理員！' });
      })
    })  // on confirm - end
    .catch(() => {    // on cancel
    });
  },

// 頁面跳轉
  jumpToCourseDetail (e){
    app.checkSubscribe();
    Toast.loading('跳轉中...')
    let selectId = e.currentTarget.dataset.courseid;
    let user = "normal"

    // 跳轉課程詳情頁
    let detailInfo = {
      user      : user,
      courseId  : selectId,
    }
    // 缺少用戶組的判斷 - 未完成
    detailInfo = JSON.stringify(detailInfo);
    console.log(detailInfo);
    wx.navigateTo({
      url: './courseDetail/courseDetail?detailInfo=' + detailInfo,
    })
  },
  jumpToallCourses (){
    wx.navigateTo({
      url: './allCourses/allCourses',
    })
  },
  jumpTomyFollowCourses (){
    wx.navigateTo({
      url: './myFollowCourses/myFollowCourses',
    })
  },
  jumpToMyCourses (){
    wx.navigateTo({
      url: './myCourses/myCourses',
    })
  },
  jumpToholdACourses (){
    // 獲取只有註冊完畢才能有的緩存數據
    const userCloudDataStorage = wx.getStorageSync('userCloudData');

    if (userCloudDataStorage) {   // 有緩存，代表已登錄且完成註冊，擁有arkid的用戶
      wx.navigateTo({
        url: './holdACourses/holdACourses',
      })
    } else {
      Dialog.confirm({
        title: '重要提示',
        message: '該功能需要登錄後操作！\n現在去登錄嗎？',
        zIndex:99999999,
      })
        .then(() => {
          // on confirm
          wx.switchTab({
            url: '../user/user',
          })
        })
        .catch(() => {
          // on cancel
        });
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
  }
});
  