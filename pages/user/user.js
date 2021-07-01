var app = getApp();

Page({
  data: {
    error:'',
    userInfo: {},
    isUserSignUp: false,
    isSignIn: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false, // 如需尝试获取用户信息可改为false
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    // userInfoGlobal:{},
    // 此處應該與雲端綁定
    userInfoGlobal : {},
    semFinishDay : '',
    // 日期變量
    today:'',
    durationDay_sem:0,
  },

  onLoad() { // user頁初始化時，請求user授權
    this.app = getApp();
    this.app.toastLoadingDIY();   // 模擬向服務器請求的延時
    this.setData({
      error: '申請授權未成功'   // 頂部error顯示信息
    })
    this.setData({
      // 對user.js的data寫入服務器/全局數據
      userInfoGlobal : app.globalData.userInfoGlobal,
      semFinishDay : app.globalData.semFinishDay
    })
    this.getUserProfile();
    if (wx.getUserProfile) {
      // if請求返回用戶信息的授權成功
      this.setData({
        // 用戶授權狀態設為true
        canIUseGetUserProfile: true
      })
      console.log("GetuserProfile success");
    }
    else{
      console.log("GetuserProfile fail");
    }
    console.log("canIUse狀態",this.data.canIUse);
    console.log("canIUseOpenData狀態",this.data.canIUseOpenData);
    console.log("獲取profile狀態",this.data.canIUseGetUserProfile);
    console.log("hasUserInfo狀態",this.data.hasUserInfo);


    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success () {
              // wx.startRecord()
              console.log("用户已经同意或拒絕小程序使用录音功能，不会再弹窗询问");
              wx.showToast({
                title: '成功授權',
              })
            },
            fail (){
              console.log("接口調用失敗");
            }
          })
        }
      }
    })

    console.log("onLoad() - user頁加載完成");
  },

  onShow () {
    this.app.sliderAnimaMode(this, 'slide_right1', 100, 1, 1, 0);
    this.app.sliderAnimaMode(this, 'slide_right2', -100, 1, 1, 0);
    // 用於刷新editPage更改後的數據
    this.setData({
      userInfoGlobal : app.globalData.userInfoGlobal
    })

// 計算持續時間
    this.calcTime();
// 計算progress進度條比值
    if (this.data.durationDay_Grudate) {
      console.log("durationDay_Grudate為",this.data.durationDay_Grudate);
      console.log("總上學時長為",(365*4 -4-31-31-8));
      let durationDay_Grudate_progress = 100-Math.round(this.data.durationDay_Grudate / (365*4 -4-31-31-8) *100);
      this.setData({
        durationDay_Grudate_progress
      })
      console.log("durationDay_Grudate_progress為(目前過了)",this.data.durationDay_Grudate_progress,'%');
    }
    
  },

  onHide () {
    this.app.sliderAnimaMode(this, 'slide_right1', -100, 0, 1, 0);
    this.app.sliderAnimaMode(this, 'slide_right2', 100, 0, 1, 0);
  },

  onPullDownRefresh() { // 觸發下拉刷新時
    this.app.onPullDownRefresh(this);
  },

  // 調用該方法可以：彈出彈窗，準確獲取用戶信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，
    // 开发者每次通过该接口获取用户个人信息均需用户确认，
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("獲取用戶信息成功",res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true // 已獲取用戶信息
        })
      },
      fail: (res) => {
        console.log("獲取用戶信息失敗：",res);
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

  calcTime (){
    // 獲取當前時間軸
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let today = Y+'/'+M+'/'+D;
    console.log("Today is",today);
    let durationDay_sem = (new Date(this.data.semFinishDay).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay_sem,
      today
    })
    console.log("今天離全局設置的完sem日還有：",durationDay_sem,"天");
    let durationDay_Grudate = (new Date(this.calcGraduateDay(Y)).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay_Grudate
    })
  },
  
  calcGraduateDay (today_Year){
    let studentYear_input = app.globalData.userInfoGlobal[3].input;
    let studentYear = ["未設置","大一","大二","大三","大四"];
    let studentYearIndex = studentYear.findIndex(o=> o== studentYear_input);
    if (studentYearIndex != 0) {
      console.log("畢業日期為",today_Year+(4-studentYearIndex)+'/'+'06'+'/'+'23');
      return(today_Year+(4-studentYearIndex)+'/'+'06'+'/'+'23');
    }
  },


})

