const db = wx.cloud.database();   // 數據庫
const _ = db.command

Page({
  data: {
    showInfo:{},
    showName:{},
    showAdmin:{}
  },

  onLoad: function (options) {
    this.app = getApp();
    // 獲取上個頁面傳遞的參數，說明用戶組和需要渲染的courseId
    let detailInfo = JSON.parse(options.detailInfo);
    console.log("上個頁面傳遞值為：",detailInfo)
    console.log("arkid為",detailInfo.arkid)

      //detailInfo.arkid = 2;   // 可以修改傳參的arkid

    // 獲取數據庫數據
    db.collection('user').where({
      arkid : detailInfo.arkid
    }) .field({
      avatarUrl      : true,
      gender         : true,
      userInfoInput  : true,
    }) .get() .then(res=>{
      const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
      if (userCloudDataStorage) {
        // 從緩存中獲取該用戶是否管理員
        this.setData({
          admin         : userCloudDataStorage.data.admin,
          userCloudData : userCloudDataStorage.data,
        })
        console.log(this.data.admin)
      }
      // 這裡開始寫處理的代碼，比如setData進data中給wxml渲染

      // 定义所需要的值
      this.setData({ 
        showYear: res.data[0].userInfoInput[3].input,
        showInfo: res.data[0].userInfoInput,
        iconInfo: res.data[0].avatarUrl,
        showMajor: res.data[0].userInfoInput[2].majorTag,
        showName: res.data[0].userInfoInput[1].input,
        showAdmin: res.data[0].userInfoInput[9].input,
        'showInfo[0].display': false,//区别普通用户和管理员可见的信息
        'showInfo[1].display': false,//普通用户不可见 UM ID、注册时间
        'showInfo[2].display': false,
        'showInfo[3].display': false,
        'showInfo[7].display': false
      });
      if(this.data.admin){    //管理员可见UM ID、注册时间
        this.setData({
          'showInfo[0].display': true,
          'showInfo[7].display': true
        });
      };
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