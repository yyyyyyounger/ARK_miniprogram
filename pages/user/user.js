var app = getApp();
var cloudData = require('../../data/json.js')


Page({
  data: {
// Vant - begin
    show_sheet_year:false,
    actions_sheet_year: [
      {
        name: '大一',
      },
      {
        name: '大二',
      },
      {
        name: '大三',
      },
      {
        name: '大四',
      },
    ],
    studentYear: ["大一", "大二", "大三", "大四"],
    show_sheet_major:false,
    actions_sheet_major: [
      {
        name: 'ECE',
      },
      {
        name: 'CPS',
      },
      {
        name: 'xxx',
      },
    ],
    studentMajor: ["ECE", "CPS", "xxx"],
    bindEditMode:false,
// Vant - end
// 用戶輸入 - begin
    UM_ID_input :'',
    studentName_input :'',
    studentYear_input :'',
    studentMajor_input :'',
// 用戶輸入 - end
    userInfo: {},
    isUserSignUp: false,
    isSignIn: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false, // 如需尝试获取用户信息可改为false
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    // 此處應該與雲端綁定
    userInfoGlobal : {},
    semFinishDay : '',
    // 日期變量
    today:'',
    durationDay_sem:0,
  },

  onLoad() { // user頁初始化時，請求user授權
    this.app = getApp();
    this.setData({  userInfoGlobal : app.globalData.userInfoGlobal,  })     // 先讓局部userInfoGlobal讀取全局.js的數據
    // this.app.toastLoadingDIY();   // 模擬向服務器請求的延時
    this.setData({
      semFinishDay : app.globalData.semFinishDay,           // display : app.globalData.userInfoGlobal.display,
      studentMajor_input : this.data.userInfoGlobal[2].input,
      studentYear_input : this.data.userInfoGlobal[3].input,
    })
    // 獲取userInfoGlobal裡允許顯示的設置數組
    let InfoDisplay = this.data.userInfoGlobal.map((item)=>{    return item.display   });
    // userInfoGlobal裡的“是否顯示”的設置
    this.setData({    InfoDisplay   });
    // 獲取userInfoGlobal裡允許顯示的設置數組
    let canEdit = this.data.userInfoGlobal.map((item)=>{    return item.canEdit    });
    // userInfoGlobal裡的“是否允許編輯”設置
    this.setData({    canEdit    });
    
    if (wx.getUserProfile) {
      // if請求返回用戶信息的授權成功
      this.setData({
        // 用戶授權狀態設為true
        canIUseGetUserProfile: true
      })
      console.log("user頁 - onLoad() - GetuserProfile success");
    }
    else{
      console.log("GetuserProfile fail");
    }
    
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope(權限)
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.record']) {
    //       wx.authorize({
    //         scope: 'scope.record',
    //         success () {
    //           // wx.startRecord()
    //           console.log("用户已经同意或拒絕小程序使用录音功能，不会再弹窗询问");
    //           wx.showToast({
    //             title: '成功授權',
    //           })
    //         },
    //         fail (){
    //           // console.log("接口調用失敗");
    //         }
    //       })
    //     }
    //   }
    // })
    this.calcTime();

  },

  onShow () {
    // this.app.sliderAnimaMode(this, 'slide_right1', 100, 1, 1, 0);
    // this.app.sliderAnimaMode(this, 'slide_right2', -100, 1, 1, 0);
    // 用於刷新editPage更改後的數據
    this.setData({
      userInfoGlobal : app.globalData.userInfoGlobal
    })
// 計算持續時間
    this.calcTime();

    console.log("onShow()完成");
  },

  onHide () {
    // this.app.sliderAnimaMode(this, 'slide_right1', -100, 0, 1, 0);
    // this.app.sliderAnimaMode(this, 'slide_right2', 100, 0, 1, 0);
  },

  onPullDownRefresh() {   // 觸發下拉刷新時
    this.app.onPullDownRefresh(this);
  },

  signUpHintBindButton (e) {
    console.log(e.detail);
    if (e.detail.index) {
      this.getUserProfile();
    }
    let that = this;
    that.setData({
      show :! that.data.show
    })
  },

  // Vant - sheet
  onClose_sheet() {
    this.setData({ 
      show_sheet_year: false,
      show_sheet_major: false,
    });
  },
  onSelect_sheet(event) {
    // console.log(event.detail.name);
    let sheet_select = event.detail.name;
    let studentYearIndex = this.data.studentYear.findIndex(o=> o== sheet_select);
    let studentMajorIndex = this.data.studentMajor.findIndex(o=> o== sheet_select);
    // console.log("所選擇的Yearinput值的索引值：", yearInputIndex );
    // console.log("所選擇的Majorinput值的索引值：", MajorInputIndex );
    if (studentYearIndex!=-1) {
      this.data.studentYear_input = this.data.studentYear[studentYearIndex];
    }
    else{
      this.data.studentMajor_input = this.data.studentMajor[studentMajorIndex];
    }
    let write2 = "userInfoGlobal[2].input";
    let write3 = "userInfoGlobal[3].input";
    this.setData({
      [write2] : this.data.studentMajor_input,
      [write3] : this.data.studentYear_input,
      studentYearIndex,
      studentMajorIndex,
    });
  },

  // 調用該方法可以：彈出彈窗，準確獲取用戶信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("用戶點擊同意，信息如下：",res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true // 已獲取用戶信息
        })
// 登錄成功後，判斷該用戶是否已註冊，若已註冊：將數據從雲端寫入到全局
// 未註冊將進入註冊頁，並保存相關信息到雲端
        app.globalData.isUserSignUp = false;  // 模擬用戶：未註冊
        if (app.globalData.isUserSignUp) {
          console.log("該用戶已註冊！");
          cloudData.writeUserInfoGlobal();
          let that = this;
          that.onHide();
          setTimeout(function () {
            that.onLoad();
            that.onShow();
          }, 500);
        }
        else {
          wx.navigateTo({
            url: './editPage/editPage',
          })
        }
        // 登錄後不用再按鈕請求登錄
        this.setData({
          canIUseOpenData : true ,
        })
        app.globalData.isSignIn = this.data.canIUseOpenData;
      },
      fail: (res) => {
        console.log("用戶點擊拒絕：",res);
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

  bindCellClick(e){   // Cell的點擊事件：獲取index
    let cellindex = e.currentTarget.dataset.cellindex;
    // console.log(cellindex);
    this.setData({      cellindex    });
    if (this.data.bindEditMode) {
      switch (cellindex) {
        case 2:
          this.setData({    show_sheet_major : true      })
          break;
        case 3:
          this.setData({    show_sheet_year : true      })
          break;
      }
    }
  },

  bindCellInput(e){   // 輸入事件
    // console.log(e.detail);
    let cellInput = e.detail;
    switch (this.data.cellindex) {
      case 0:
        console.log("cellIndex為0：",this.data.cellindex);
        this.setData({    UM_ID_input : cellInput      })
        break;
      case 1:
        console.log("cellIndex為1：",this.data.cellindex);
        this.setData({    studentName_input : cellInput      })
        break;
    }
  },

  // 編輯資料的確認按鈕
  bindEditPage_confirm(){
    let that = this;
// 如果輸入符合條件，才能寫入本地的userInfoGlobal
    let write0 = "userInfoGlobal[0].input";
    let write1 = "userInfoGlobal[1].input";
    let write2 = "userInfoGlobal[2].input";
    let write3 = "userInfoGlobal[3].input";
    that.setData({        // 寫入局部userInfoGlobal數據，這種data寫法可以保證展示頁刷新
      bindEditMode :! that.data.bindEditMode,
      [write0] : that.data.UM_ID_input,
      [write1] : that.data.studentName_input,
      [write2] : that.data.studentMajor_input,
      [write3] : that.data.studentYear_input,
    });
    // 寫入全局data記錄
    app.globalData.userInfoGlobal = that.data.userInfoGlobal;
  },
  // 編輯資料的取消按鈕
  bindEditPage_cancel(){
    this.setData({      bindEditMode :! this.data.bindEditMode    });
  },

  calcTime (){
    // 獲取當前時間軸
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    // console.log("当前时间戳为：" + timestamp);
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
    // console.log("今天離全局設置的完sem日還有：",durationDay_sem,"天");
    let durationDay_Grudate = (new Date(this.calcGraduateDay(Y)).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay_Grudate
    })


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
  calcGraduateDay (today_Year){
    let studentYear_input = app.globalData.userInfoGlobal[3].input;
    let studentYear = ["未登入","大一","大二","大三","大四"];
    let studentYearIndex = studentYear.findIndex(o=> o== studentYear_input);
    if (studentYearIndex != 0) {
      console.log("畢業日期為",today_Year+(4-studentYearIndex)+'/'+'06'+'/'+'23');
      return(today_Year+(4-studentYearIndex)+'/'+'06'+'/'+'23');
    }
  },

})

