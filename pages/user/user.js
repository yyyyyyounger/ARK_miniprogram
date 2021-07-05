var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var cloudData = require('../../data/cloud.js')
const beforeClose = (action) => new Promise((resolve) => {
  setTimeout(() => {
    if (action === 'confirm') {
      resolve(true);
    } else {
      // 拦截取消操作
      resolve(false);
    }
  }, 1000);
});

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
    studentYear: [],
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
    studentMajor: [],
    bindEditMode:false,
// Vant - end
// 用戶輸入 - begin
    UM_ID_input :'',
    studentName_input :'',
    studentYear_input :'',
    studentMajor_input :'',
// 用戶輸入 - end
// 自定義的用戶數據 - begin
    userInfoInput : {},
    userInfoInput_umIdIndex : '',
    userInfoInput_nameIndex : '',
    userInfoInput_studentMajorIndex : '',
    userInfoInput_studentYearIndex : '',
    userInfoInput_holdTimesIndex : '',
    userInfoInput_joinTimesIndex : '',
    userInfoInput_starsIndex : '',
    userInfoInput_signUpTimeIndex : '',
    userInfoInput_arkIdIndex : '',
    userInfoInput_adminIndex : '',
    userInfoInput_isSignUpIndex : '',

    isSignIn: false,
    isSignUp: false,
// 自定義的用戶數據 - end
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
// 此處應該與雲端綁定
    semFinishDay : '',
// 日期變量
    today:'',
    durationDay_sem:0,
  },

  onLoad() {
// 設置app.js的訪問接口
    this.app = getApp();
    // this.app.toastLoadingDIY();   // 模擬向服務器請求的延時

// 查詢用戶授權登錄狀態，保存頭像等操作，需要後端融合
    // https://developers.weixin.qq.com/community/develop/article/doc/000a4e9d86002857cf687226851413

    
// 拉取數據(複製) - userInfoInput - 雲端 → 本地
    if (!this.data.isSignIn) {              // if 未登錄，則 複製雲端空數據 → 本地
      let arrayEmpty = JSON.parse(JSON.stringify(cloudData.userInfoInput_empty));
      this.setData({  userInfoInput : arrayEmpty  });
      var consoleMeg = '未登錄 - ';
    }
    else {                                  // if 已登錄，歡迎語
      let userSignUpState = cloudData.userInfoInput.find(o => o.shortName === 'isSignUp').input;   // 查找名為isSignUp的對象
      if (userSignUpState) {             // if 已登錄，已註冊，個性化歡迎語
        // 從雲端複製有意義的數據 → 本地
        let arraySignUp = JSON.parse(JSON.stringify(cloudData.userInfoInput));
        this.setData({  userInfoInput : arraySignUp  });
        let userNameInput = cloudData.userInfoInput.find(o => o.shortName === 'name');   // 查找名為isSignUp的對象
        Toast('Dear '+userNameInput.input+' , Welcome Back ~');    // 個性化歡迎語
      }
      else{                                 // 已登錄，未註冊完成的user，提示註冊
        Toast('請盡快前往個人信息頁完成註冊喔 !');
      }
      var consoleMeg = '已登錄 - ';
    }
    console.log(consoleMeg+'本地的userInfo為',this.data.userInfoInput);
    // 生成簡易版(無input版)userInfo數組
    let shortNameArray =    this.data.userInfoInput.map((item)=>{    return item.shortName   });
    this.setData({
      userInfoInput_umIdIndex :         shortNameArray.findIndex(o=> o== "umId"),
      userInfoInput_nameIndex :         shortNameArray.findIndex(o=> o== "name"),
      userInfoInput_studentMajorIndex : shortNameArray.findIndex(o=> o== "studentMajor"),
      userInfoInput_studentYearIndex :  shortNameArray.findIndex(o=> o== "studentYear"),
      userInfoInput_holdTimesIndex :    shortNameArray.findIndex(o=> o== "holdTimes"),
      userInfoInput_joinTimesIndex :    shortNameArray.findIndex(o=> o== "joinTimes"),
      userInfoInput_starsIndex :        shortNameArray.findIndex(o=> o== "stars"),
      userInfoInput_signUpTimeIndex :   shortNameArray.findIndex(o=> o== "signUpTime"),
      userInfoInput_arkIdIndex :        shortNameArray.findIndex(o=> o== "arkId"),
      userInfoInput_adminIndex :        shortNameArray.findIndex(o=> o== "admin"),
      userInfoInput_isSignUpIndex :     shortNameArray.findIndex(o=> o== "isSignUp"),

      UM_ID_input :         this.data.userInfoInput.find(o => o.shortName === 'umId').input ,
      studentName_input :   this.data.userInfoInput.find(o => o.shortName === 'name').input ,
      studentMajor_input :  this.data.userInfoInput.find(o => o.shortName === 'studentMajor').input ,
      studentYear_input :   this.data.userInfoInput.find(o => o.shortName === 'studentYear').input , 
      starsLevel :          this.data.userInfoInput.find(o => o.shortName === 'stars').input , 
      isSignUp :            this.data.userInfoInput.find(o => o.shortName === 'isSignUp').input , 
      bindEditMode :        false,

      semFinishDay :  cloudData.semFinishDay,
      studentYear :   cloudData.studentYear,
      studentMajor :  cloudData.studentMajor,
    })
    let studentMajorArray = [];
    for (let i = 0; i < this.data.studentMajor.length; i++) { // 抽取數組元素 插入對象數組
      let studentMajorObj = {};
      studentMajorObj.name = this.data.studentMajor[i];
      studentMajorArray.push(studentMajorObj);
    }
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = this.data.userInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = this.data.userInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    this.setData({    InfoDisplay, canEdit, actions_sheet_major:studentMajorArray    });
    
    
// 未理解的神秘執行 - 未完成
    if (wx.getUserProfile) {
      this.setData({
        // 用戶授權狀態設為true
        canIUseGetUserProfile: true
      })
    }   else{
      console.log("user頁 - onLoad() - GetuserProfile ***fail***");
    }

// 計算持續時間
    this.calcTime();
  },

  onShow () {
    // this.app.sliderAnimaMode(this, 'slide_right1', 100, 1, 1, 0);
    // this.app.sliderAnimaMode(this, 'slide_right2', -100, 1, 1, 0);



    console.log("onShow()完成");
  },

  onHide () {
    // this.app.sliderAnimaMode(this, 'slide_right1', -100, 0, 1, 0);
    // this.app.sliderAnimaMode(this, 'slide_right2', 100, 0, 1, 0);
  },

  onPullDownRefresh() {   // 觸發下拉刷新時
    this.app.onPullDownRefresh(this);
  },

  // Vant - sheet
  onClose_sheet() {
    this.setData({ 
      show_sheet_year: false,
      show_sheet_major: false,
    });
  },
  onSelect_sheet(event) {
    let sheet_select = event.detail.name;   // 這是選取項的名
    let studentYearIndex = this.data.studentYear.findIndex(o=> o== sheet_select);
    let studentMajorIndex = this.data.studentMajor.findIndex(o=> o== sheet_select);
    // console.log("所選擇的Yearinput值的索引值：", yearInputIndex );
    // console.log("所選擇的Majorinput值的索引值：", MajorInputIndex );
    // 索引值是-1則代表：選擇了不屬於這個數組的元素
    if (studentYearIndex!=-1) {             // 選取了studentYear的數據時，選項 → 本地數據
      this.setData({  studentYear_input : this.data.studentYear[studentYearIndex]  })
    }   else{                               // 選取了studentMajor的數據時，選項 → 本地數據
      this.setData({  studentMajor_input : this.data.studentMajor[studentMajorIndex]  })
    }
// 將inputIndex寫入本地數據，只作為選擇數據參考
    this.setData({
      studentYearIndex,
      studentMajorIndex,
    });
  },

  // 點擊登錄按鈕 - 綁定事件
  binSignInButton() {
    // 提示閱讀使用條款
    Dialog.alert({
      message: '繼續登錄將表示您已閱讀並同意該小程序的使用條款',
    }).then(() => {
      // on close
      this.getUserProfile();
    });
  },

  // 獲取用戶信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，
// 开发者妥善保管用户的头像昵称，避免重复弹窗 - 未完成
    wx.getUserProfile({
      desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        Notify({ type: 'success', message: '登錄成功！' });
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true, // 已獲取用戶信息
          isSignIn:true      // 成功登錄後，局部isSignIn → true：用戶已登錄
        })
// 成功登錄後，局部 → 全局isSignIn → true
        app.globalData.isSignIn = true;
// 登錄成功後，判斷是否已註冊
        let isSignUp = cloudData.userInfoInput.find(o => o.shortName === 'isSignUp').input;
        console.log("登錄成功 - 註冊狀態：", isSignUp );
// 拉取數據 - 雲端 → 本地
        if (isSignUp) {       // 已註冊：將 雲端數據（cloud.js）複製 → 本地
          let arraySignUp = JSON.parse(JSON.stringify(cloudData.userInfoInput));
          this.setData({  userInfoInput : arraySignUp  });
          this.onLoad();
        }
        else {                // 未註冊，提示進入註冊頁
          Dialog.confirm({
            title: '系統提示',
            message: '現在填寫必要資料 (完成註冊) 嗎',
          })
            .then(() => {
              // on confirm
              this.setData({  bindEditMode : true  });
            })
            .catch(() => {
              // on cancel
              this.setData({  bindEditMode : false  });
              Notify({ type: 'warning', message: '現在仍不是正式成員喔' });
            });
        }
// 登錄後不用再使用按鈕請求登錄（保存用戶頭像等信息） - 未完成
        this.setData({
          canIUseOpenData : true ,
        })
      },  // success - end
      fail: (res) => {
        console.log("用戶點擊拒絕：",res);
        Notify({ type: 'warning', duration: 3500, message: '登錄失敗QAQ，微信登錄只為了獲取您的頭像暱稱，從而獲得一個獨立的標識id喔！' });
      }   // fail - end
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

  bindCellClick(e){       // Cell的點擊事件：獲取index
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

  bindCellInput(e){       // 輸入框 - 輸入事件，數據 → 本地 → UM_ID & studentName
    let cellInput = e.detail.toUpperCase();
    let inputLength = cellInput.length;
    switch (this.data.cellindex) {
      case this.data.userInfoInput_umIdIndex:
        // console.log("cellIndex為0：",this.data.cellindex);
        let mes = '';   let mesError = '';
        let noticeType = '';
        this.setData({    UM_ID_input : cellInput      })
        if (inputLength < 8 && inputLength!=0 && inputLength!=-1) {
          mes = '太少了！請輸入8位的學號！';  mesError = mes;
          noticeType = 'danger';
        }
        else if (inputLength == 8) {
          mes = 'Very Nice！';  mesError = '';
          noticeType = 'success';
        }
        Notify({ type: noticeType, message: mes });
        this.setData({ umIdError : mesError })
      break;
      case this.data.userInfoInput_nameIndex:
        // console.log("cellIndex為1：",this.data.cellindex);
        this.setData({    studentName_input : cellInput      })
        if (inputLength==0 || inputLength==-1) {
          mes = '姓名不能為空！';
        }
        else{
          mes = '';
        }
        Notify({ type: 'danger', message: mes });
        this.setData({ nameError : mes })
      break;
    }
  },

  // 編輯資料的確認按鈕
  bindEditPage_confirm(){
    let idError =     !this.data.UM_ID_input        || !!this.data.umIdError;
    let nameError =   !this.data.studentName_input  || !!this.data.nameError;
    idError =         idError   || (this.data.UM_ID_input        == cloudData.userInfoInput_empty.find(o => o.shortName === 'umId').input);
    nameError =       nameError || (this.data.studentName_input  == cloudData.userInfoInput_empty.find(o => o.shortName === 'name').input);
    let majorError =  (this.data.studentMajor_input == cloudData.userInfoInput_empty.find(o => o.shortName === 'studentMajor').input);
    let yearError =   (this.data.studentYear_input  == cloudData.userInfoInput_empty.find(o => o.shortName === 'studentYear').input);

    if ( idError || nameError || majorError || yearError ) {    //數據不完整 觸發提示
      Toast('請完整錄入相關數據！');
      if (idError) {
        Toast('idError！');
      }
      if (nameError) {
        Toast('nameError！');
      }
      if (majorError) {
        Toast('majorError！');
      }
      if (yearError) {
        Toast('yearError！');
      }
    }
    else {    // 如果輸入符合條件，此處應添加向服務端詢問是否允許的步驟(學號檢驗是否重合) - 未完成
      let that = this;
// 寫入本地的userInfoInput
      let w0 = this.data.userInfoInput.findIndex(o=> o.shortName === 'umId' );
      let w1 = this.data.userInfoInput.findIndex(o=> o.shortName === 'name' );
      let w2 = this.data.userInfoInput.findIndex(o=> o.shortName === 'studentMajor' );
      let w3 = this.data.userInfoInput.findIndex(o=> o.shortName === 'studentYear' );
      let write0 = 'userInfoInput['+w0+'].input';
      let write1 = 'userInfoInput['+w1+'].input';
      let write2 = 'userInfoInput['+w2+'].input';
      let write3 = 'userInfoInput['+w3+'].input';
      that.setData({        // 寫入局部userInfoInput數據，setData寫法可以保證展示頁刷新
        bindEditMode : false,
        [write0] : that.data.UM_ID_input,
        [write1] : that.data.studentName_input,
        [write2] : that.data.studentMajor_input,
        [write3] : that.data.studentYear_input,
      });
  
      let userInfo_isSignUpIndex = that.data.userInfoInput.findIndex(o=> o.shortName === 'isSignUp' );
// if 本地註冊狀態為false，但能來到此的邏輯都是能正確註冊，因此寫入本地註冊時間和ARKid - 未完成
      if (!that.data.userInfoInput[userInfo_isSignUpIndex].input) {
        let wTime = that.data.userInfoInput.findIndex(o=> o.shortName === 'signUpTime' );
        let writeTime = 'userInfoInput['+wTime+'].input';
        // console.log(that.data.today);
        that.setData({  [writeTime] : that.data.today,  })
        // ARKid
        let arkIdLocal = Math.round(Math.random()*1000);  // 此處的ARKid用的是隨機數
        let wArkId = that.data.userInfoInput.findIndex(o=> o.shortName === 'arkId' );
        let writeArkId = 'userInfoInput['+wArkId+'].input';
        that.setData({  [writeArkId] : arkIdLocal,  })
      }
// 修改本地註冊狀態為 true
      that.data.userInfoInput[userInfo_isSignUpIndex].input = true;
// 上傳數據 本地 → 雲端
      // 轉化為字符串才能對比數組
      if ( JSON.stringify(cloudData.userInfoInput) == JSON.stringify(that.data.userInfoInput) ) {
        console.log("完全沒有修改呢！");
      }
      else {    // 本地 → 雲端，更新數組
        console.log("有修改！Update！");
        cloudData.userInfoInput = that.data.userInfoInput;
      }
      console.log("上傳後雲端的數據：",cloudData.userInfoInput);
      Notify({ type: 'success', message: '修改成功！建議使用下拉刷新頁面喔！' });
      this.onLoad();
    }
    if (this.data.mesError) {
      Toast(this.data.mesError);
    }
    if (this.data.mes) {
      Toast(this.data.mes);
    }
  },
  // 編輯資料的取消按鈕
  bindEditPage_cancel(){
    this.setData({      bindEditMode :! this.data.bindEditMode   });
    let notifyText = '';  let notifyMode = '';
    if (this.data.bindEditMode) {
      notifyText = '進入編輯模式';
      notifyMode = 'primary';
    }   else {
      notifyMode = 'success';
      notifyText = '離開編輯模式';
    }
    Notify({ type: notifyMode, message: notifyText });

    if (!this.data.isSignUp) {    // 如果註冊狀態為false時
      Notify({ type: 'warning', message: '抓緊時間註冊！現在仍不是正式成員喔！' });
    }
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
    let studentYear_inputFun = this.data.userInfoInput[this.data.userInfoInput_studentYearIndex].input;
    let studentYearFun = JSON.parse(JSON.stringify(this.data.studentYear));
    // 在該數組開頭插入，empty數組的空輸入
    studentYearFun.unshift(cloudData.userInfoInput_empty.find(o=> o.shortName== "studentYear").input );
    let studentYearIndexFun = studentYearFun.findIndex(o=> o== studentYear_inputFun);

    if (studentYearIndexFun != 0) {
      console.log("畢業日期為",today_Year+(4-studentYearIndexFun)+'/'+'06'+'/'+'23');
      return(today_Year+(4-studentYearIndexFun)+'/'+'06'+'/'+'23');
    }
  },

})

