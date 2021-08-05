import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

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
    // 模擬向服務器請求的延時
    // this.app.toastLoadingDIY();

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
        db.collection('user').where({
          _id : userCloudDataStorage.data._openid,
        }) .field({
          recentFollowCourseArray : true
        }) .get() .then(res=>{
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
    // 正常應該只能follow 20節課，獲取資料的時候默認20條記錄限制
    // 記錄Follow的課程id
    let selectCourse = e.currentTarget.dataset.courseid;
    console.log("請求add",selectCourse);
    for (let i = 0; i < this.data.recentCourseInfoArray.length; i++) {
      if (this.data.recentCourseInfoArray[i]._id == selectCourse) {
        this.setData({  ['recentCourseInfoArray['+i+'].haveFollow'] : true  })    // 同步wxml的顯示
      }
    }

    // 調用雲函數更新 - user集合 - recentFollowCourseArray數組
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
    db.collection('user').doc(userCloudDataStorage.data._openid).update({
      data: {
        recentFollowCourseArray: _.push([selectCourse]),
      }
    }) .then(res=>{
      Toast('Follow成功！課程編號：'+selectCourse+'\n可前往 “我的Follow” 查看');

      // 將該user的基本信息導入到該courseId的followMember數組內
      db.collection('course').doc(selectCourse).update({
        data: {
          followMember : _.push([{
            arkid     : userCloudDataStorage.data.arkid,
            avatarUrl : userCloudDataStorage.data.avatarUrl,
            name      : userCloudDataStorage.data.userInfoInput[1].input,
          }]),
        }
      }) .catch(err=>{  console.error(err);  })
    }) .catch(err=>{
      console.error(err);
    })
    
    // 詢問是否同意微信訂閱 開課消息
  },
  // 刪除follow的課程
  deleteFollow(e){
    // 記錄Follow的課程id
    let selectCourse = e.currentTarget.dataset.courseid;
    console.log("請求delete",selectCourse);
    for (let i = 0; i < this.data.recentCourseInfoArray.length; i++) {
      if (this.data.recentCourseInfoArray[i]._id == selectCourse) {
        this.setData({  ['recentCourseInfoArray['+i+'].haveFollow'] : false  })
      }
    }

    // 調用雲函數更新 - user集合 - recentFollowCourseArray數組
    const _ = db.command
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
    db.collection('user').doc(userCloudDataStorage.data._openid).update({
      data: {
        recentFollowCourseArray: _.pull(_.in([selectCourse]))
      }
    }) .then(res=>{
      Toast('刪除成功！');

      // 刪除followMember數組內該user的arkid等數據
      db.collection('course').doc(selectCourse).update({
        data: {
          followMember : _.pull( {
            arkid     : _.eq(userCloudDataStorage.data.arkid),
          } ),
        }
      }) .catch(err=>{ console.error(err); })
    }) .catch(err=>{ console.error(err); })

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
  jumpTomyJoinCourses (){
    wx.navigateTo({
      url: './myJoinCourses/myJoinCourses',
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
  