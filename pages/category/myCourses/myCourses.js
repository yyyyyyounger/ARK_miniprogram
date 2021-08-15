// pages/category/myCourses/myCourses.js
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';

var cloudData = require('../../../data/cloud.js')
const db = wx.cloud.database();
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCoursesIndexArray: [],
    myCoursesInfoArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.app = getApp();
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    // 向服務器請求的延時
    Toast.loading({
      message: '瘋狂加載中...',
      forbidClick: true,
      zIndex: 9999999999999,
    });

    if (userCloudDataStorage) {
      db.collection('user').doc(userCloudDataStorage.data._openid)
      .field({
        myCourses: true
      }).get()
      .then(res=>{
        console.log("myCoursesArray的資料為", res.data.myCourses);
        this.setData({ myCoursesIndexArray: res.data.myCourses });

        db.collection('course').where({
          _id: _.in(this.data.myCoursesIndexArray)
        }).get()
        .then(res=>{
          console.log("course的資料為", res.data);
          this.setData({ myCoursesInfoArray: res.data })

        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      url: '../courseDetail/courseDetail?detailInfo=' + detailInfo,
    })
  }
})

