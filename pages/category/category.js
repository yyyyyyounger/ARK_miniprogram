import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

var cloudData = require('../../data/cloud.js')
var app = getApp();

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
    haveFollowArray:[],

  },
  onLoad: function(page) {
    this.app = getApp();
    // 模擬向服務器請求的延時
    // this.app.toastLoadingDIY();
    
    // 如果雲端存在近一個月的courseId，返回其簡單版的資訊（主題、時間、地點） - 雲端操作未完成
    if (cloudData.recentCourseIdRecord) {
      this.setData({  recentCourseIdRecord:cloudData.recentCourseIdRecord  })
      // 向雲端請求返回該些courseId代表的課程數據 - 未完成
      this.setData({  recentCourseInfoArray:cloudData.recentCourseInfoArray  })
    }
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
    // 記錄課程id
    let selectCourse = e.currentTarget.dataset.courseid;
    let followCourseArrayTemp = JSON.parse(JSON.stringify(this.data.followCourseArray));
    followCourseArrayTemp.push(selectCourse);
    let haveFollowTemp = JSON.parse(JSON.stringify(this.data.haveFollowArray));
    let haveFollowObj = {};
    haveFollowObj.courseid = selectCourse;
    haveFollowObj.followState = true;
    haveFollowTemp.push(haveFollowObj);
    this.setData({
      followCourseArray : followCourseArrayTemp,
      haveFollowArray   : haveFollowTemp,
    })
  },
  // 刪除follow的課程
  deleteFollow(e){

  },

// 頁面跳轉
  jumpToCourseDetail (){
    wx.navigateTo({
      url: './courseDetail/courseDetail',
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
  