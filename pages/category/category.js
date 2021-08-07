import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

var cloudData = require('../../data/cloud.js')
var app = getApp();
const db = wx.cloud.database();
const _ = db.command


Page({
  data: {
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
  onLoad: function(page) {
    this.app = getApp();
    // 向服務器請求的延時
    Toast.loading({
      message: '瘋狂加載中...',
      forbidClick: true,
      zIndex: 9999999999999,
    });

    // 如果雲端存在近一個月的courseId，返回其簡單版的資訊（主題、時間、地點） - 未完成
    let date = new Date(Date.now());                    // 現在時刻的時間戳
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
        db.collection('user').doc(userCloudDataStorage.data._openid) .field({
          recentFollowCourseArray : true
        }) .get() .then(res=>{
          console.log("數據庫我的followCourseArray為：",res.data.recentFollowCourseArray);
          this.setData({  followCourseArray : res.data.recentFollowCourseArray  })
          
          let recentCourseIdRecordArr={};
          this.data.recentCourseInfoArray.map(function (e, index, item) {
            recentCourseIdRecordArr[index] = e._id;
          });
          console.log("recentCourseIdRecordArr為",recentCourseIdRecordArr);
          // 向已經follow的courseId的課程信息數組上寫入haveFollow，用於wxml渲染
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

          // 刪除自己的follow列表中已過期的課程id
          let havePastCourse = [];
          // db.collection('user').doc(userCloudDataStorage.data._openid).update({
          //   data: {
          //     recentFollowCourseArray: _.pull(_.in([selectCourse]))
          //   }
          // }) .then(res=>{         // 成功提示 & 同步wxml的顯示
          //   Toast('刪除成功！');
          //   // 同步wxml的顯示
          //   for (let i = 0; i < this.data.recentCourseInfoArray.length; i++) {
          //     if (this.data.recentCourseInfoArray[i]._id == selectCourse) {
          //       this.setData({  ['recentCourseInfoArray['+i+'].haveFollow'] : false  })
          //     }
          //   }
          // }) .catch(err=>{ console.error(err); })

          // 生成已經Follow了的課程Info的數組形式
          this.setData({  recentCourseInfoArray  })
        }) .catch(err=>{ console.error(err); })

    }) .catch(err=>{
        console.error(err);
    })

  },
  onReady: function() {
    
  },
  onShow: function() {
    this.getTabBar().init();
  },
  onHide: function() {

  },
  onPullDownRefresh: function() {
    this.app.onPullDownRefresh(this);
  },

  // 頂部tabs的點擊切換事件 - 不同tabs時執行不同，節省資源，未完成
  onClick_tabs(e) {
    console.log("點擊了tabs：",e.detail.name);
    switch (e.detail.name) {
      case 0:
        
        break;
    
      case 1:
      
        break;
    
      case 2:
        
        break;
    
      case 3:
        
        break;
    }
  },

  // 下拉菜單
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
    const userCloudData = wx.getStorageSync('userCloudData');
    if (userCloudData) {    // 已登錄才可以操作
      Dialog.confirm({
        title: '重要提示',
        message: 'follow了不要反悔喔！😎',
        zIndex:99999999,
      })
      .then(res=>{            // on confirm
        // 加載提示
        Toast.loading({
          message: '拼命加載中...',
          forbidClick: true,
        });
        // 正常應該只能follow 20節課，獲取資料的時候默認20條記錄限制
        
        let selectCourse = e.currentTarget.dataset.courseid;  // 記錄Follow的課程id
        let arrindex = e.currentTarget.dataset.arrindex;
        console.log("請求add",selectCourse);
        console.log("arrindex為",arrindex);
    
        // 雲函數更新 - user集合 - recentFollowCourseArray數組
        const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
        // 權限問題需要調用雲函數
        wx.cloud.callFunction({ // user基本信息導入到該courseId的followMember數組內
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
              recentFollowCourseArray: _.push([selectCourse]),
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
  // 刪除follow的課程
  deleteFollow(e){
    // 防誤觸式提問
    Dialog.confirm({
      title: '重要提示',
      message: '就這麼忍心說ByeBye嗎？😭',
      zIndex:99999999,
    })
    .then(() => {     // on confirm
      // 加載提示
      Toast.loading({
        message: '拼命加載中...',
        forbidClick: true,
      });
      
      // 記錄Follow的課程id
      let selectCourse = e.currentTarget.dataset.courseid;
      let arrindex = e.currentTarget.dataset.arrindex;
      console.log("請求delete",selectCourse);

      // 調用雲函數更新 - user集合 - recentFollowCourseArray數組
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
            recentFollowCourseArray: _.pull(_.in([selectCourse]))
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
    // 跳轉課程詳情頁
    let detailInfo = {
      user      : "normal",
      courseId  : e.currentTarget.dataset.courseid,
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
});
  