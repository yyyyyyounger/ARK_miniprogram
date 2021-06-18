var app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    userInfoGlobal : app.globalData.userInfoGlobal,
    // 此處需要與雲端綁定
    UM_id_local : app.globalData.UM_id_local,
    student_year : app.globalData.student_year,
    student_major : app.globalData.student_major,
    hold_time : app.globalData.hold_time,
    join_time : app.globalData.join_time,
  },

  onLoad() { // 該頁面初始化時，請求user授權
    if (wx.getUserProfile) {
      // if請求返回用戶信息的授權成功
      this.setData({
        // 用戶授權狀態設為true
        canIUseGetUserProfile: true
      });
    }
    console.log("未完成 - onLoad時應該從雲端獲取該用戶的信息");
  },

  // 調用該方法可以：彈出彈窗，準確獲取用戶信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，
    // 开发者每次通过该接口获取用户个人信息均需用户确认，
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true // 已獲取用戶信息
        })
      }
    })
  },

  // 調用該方法可以：不彈出彈窗，直接返回匿名用戶信息
  getUserInfo(e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  editProfile(){
    wx.navigateTo({
      url: './editPage/editPage',
    })
  },

  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
  }

})
