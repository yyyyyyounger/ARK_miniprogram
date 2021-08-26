const db = wx.cloud.database();   // 數據庫
const _ = db.command


Page({
  data: {

  },

  onLoad: function (options) {
    this.app = getApp();
    // 獲取上個頁面傳遞的參數，說明用戶組和需要渲染的courseId
    let detailInfo = JSON.parse(options.detailInfo);
    console.log("上個頁面傳遞值為：",detailInfo)
    console.log("arkid為",detailInfo.arkid)

    // detailInfo.arkid = 2;   // 可以修改傳參的arkid

    // 獲取數據庫數據
    db.collection('user').where({
      arkid : detailInfo.arkid
    }) .field({
      avatarUrl      : true,
      gender         : true,
      userInfoInput  : true,
    }) .get() .then(res=>{
      let userInfo = res.data[0]
      console.log(userInfo);
      // 這裡開始寫處理的代碼，比如setData進data中給wxml渲染
    })

  },

  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },

  // 頁面跳轉
  jumpToCourseDetail (e){
    let arkid = e.currentTarget.dataset.courseid;

    // 跳轉課程詳情頁
    let detailInfo = {
      arkid  : arkid,
    }

    detailInfo = JSON.stringify(detailInfo);
    console.log(detailInfo);
    wx.navigateTo({
      url: './courseDetail/courseDetail?detailInfo=' + detailInfo,
    })
  },
})