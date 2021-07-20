var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var cloudData = require('../../data/cloud.js')
const db = wx.cloud.database();   // 數據庫

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

const getUserCloudData = () => {    // 新增promise，抓取所調用雲函數的返回值，準備鏈式調用
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({   // 獲取數據庫該用戶的資料
      name: 'getUserCloudData',
    }) 
    .then(res => {
      resolve(res);
    }) 
    .catch(err => {
      reject(err);
      console.log(err);
    })
  });
};


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
    var date = new Date(Date.parse(new Date()));    // Date.parse(new Date()) 和 Date.now()為當前時間戳 - 數字。new Date(時間戳)後化為帶有中文的字符串
    console.log(date.toLocaleDateString());

// app.toastLoadingDIY();   // 模擬向服務器請求的延時
// 設置app.js的訪問接口
    this.app = getApp();
    var consoleMeg = '';

// 查詢用戶授權登錄狀態，保存頭像等操作，需要後端融合

// 拉取數據(複製) - userInfoInput - 雲端 → 本地
    if (!this.data.isSignIn) {              // if 未登錄，則 複製cloudData.js的空數據 → 本地
      let arrayEmpty = JSON.parse(JSON.stringify(cloudData.userInfoInput_empty));
      this.setData({  
        userInfoInput       : arrayEmpty,
        userInfoInput_empty : arrayEmpty,
      });
      consoleMeg = '未登錄 - ';
    }
    else {                                  // if 已登錄，歡迎語
      // 返回majorTagArray的信息
      db.collection('config').doc('studentMajor') .get().then(res=>{
        // res.data為'studentMajor'記錄的數據
        this.setData({
          majorTagArray : res.data.majorTagArray, 
          studentMajor  : res.data.studentMajor, 
        })
      }) .then(res=>{ // 將元素寫入major的選項對象
        let studentMajorArray = [];
        for (let i = 0; i < this.data.studentMajor.length; i++) { 
          let studentMajorObj = {};
          studentMajorObj.name = this.data.studentMajor[i];
          studentMajorArray.push(studentMajorObj)
        }
        this.setData({  actions_sheet_major:studentMajorArray  })
      }).catch(err=>{  console.error(err);  })

      getUserCloudData().then(res => {  // 鏈式調用，返回用戶登記的數據
        console.log("鏈式調用getUserCloudData，返回數組長度為：",res.result.userCloudData.data.length)
        if (res.result.userCloudData.data.length!=0) {  // 已註冊，將 數據庫user數據複製 → 本地&全局
          let userCloudData = res.result.userCloudData.data[0];
          // 拉取user數據 - 雲端 → 本地&全局
          let signUpUserInfoInput = JSON.parse(JSON.stringify(userCloudData.userInfoInput));  // 複製數據
          this.setData({  
            userInfoInput : signUpUserInfoInput,
            isSignUp      : signUpUserInfoInput.find(o => o.shortName === 'isSignUp').input , 
          });
          app.globalData.userInfoInput = JSON.parse(JSON.stringify(signUpUserInfoInput));
          // 個性化歡迎語
          let userNameInput = this.data.userInfoInput.find(o => o.shortName === 'name');   // 查找用戶修改的姓名
          Toast('Dear '+userNameInput.input+' , Welcome Back ~');    // 個性化歡迎語  
        }
        else{                                           // 未註冊，提示註冊
          Toast('請盡快前往個人信息頁完成註冊喔 !');
        }
      }) .catch(err => {    console.log(err);    });

      consoleMeg = '已登錄 - ';
    }
    console.log(consoleMeg+'當前js的userInfo為',this.data.userInfoInput); // log出提示消息
    // 生成 無input版 userInfo的shortName數組
    let shortNameArray =    this.data.userInfoInput.map((item)=>{    return item.shortName   });
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = this.data.userInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = this.data.userInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    this.setData({    InfoDisplay, canEdit, shortNameArray    });
    this.findSetData(this.data.shortNameArray); // 初始化所有index值
    
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
  findSetData(shortNameArray) { // 初始化所有index，匹配對應input值用於顯示
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
      // studentMajor :  cloudData.studentMajor,
    })
  },

  onShow () {
    this.getTabBar().init();
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
    // 索引值是-1則代表：選擇了不屬於這個數組的元素
    if (studentYearIndex!=-1) {             // 選取了studentYear的數據時，選項 → 本地數據
      this.setData({  studentYear_input : this.data.studentYear[studentYearIndex]  })
    }   else{                               // 選取了studentMajor的數據時，選項 → 本地數據
      this.setData({  
        studentMajor_input : this.data.studentMajor[studentMajorIndex],
        studentMajorTag_input : this.data.majorTagArray[studentMajorIndex],
      })
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

  // 點擊登錄 - 獲取用戶信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，
    const getUserProfilePro = () => {    // 新增promise，抓取所調用api的返回值，準備鏈式調用
      return new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        }) 
        .then(res => {
          resolve(res);
        }) 
        .catch(err => {
          console.log(err);
          reject(err);
        })
      });
    };

    getUserProfilePro().then(res=>{    // 同意登錄
      Notify({ type: 'success', message: '登錄成功！' });
      this.setData({
        userInfo: res.userInfo, // 用戶暱稱、頭像數據
        hasUserInfo: true, // 已獲取用戶信息
        isSignIn:true      // 成功登錄後，局部isSignIn → true：用戶已登錄
      })
      // 成功登錄後，局部 → 全局isSignIn → true
      app.globalData.isSignIn = true;

      // 返回majorTagArray的信息
      db.collection('config').doc('studentMajor') .get().then(res=>{
        this.setData({
          majorTagArray : res.data.majorTagArray, 
          studentMajor  : res.data.studentMajor, 
        })
        // 抽取數組元素 插入major選項數組
        let studentMajorArray = [];
        for (let i = 0; i < this.data.studentMajor.length; i++) { 
          let studentMajorObj = {};
          studentMajorObj.name = this.data.studentMajor[i];
          studentMajorArray.push(studentMajorObj)
        }
        this.setData({  actions_sheet_major:studentMajorArray  })
      }) .catch(err=>{  console.error(err);  })

      // 登錄成功後，判斷是否已註冊 - 數據庫是否存在該用戶openid（查找_id）
      getUserCloudData().then(res => {    // 鏈式調用，能在該鏈上使用該promise的返回值
        console.log("鏈式調用getUserCloudData，返回數組長度為：",res.result.userCloudData.data.length)
        if (res.result.userCloudData.data.length!=0) {  // 已註冊，將 數據庫user數據複製 → 本地&全局
          let userCloudData = res.result.userCloudData.data[0];
// 拉取user數據 - 雲端 → 本地&全局
          let signUpUserInfoInput = JSON.parse(JSON.stringify(userCloudData.userInfoInput));  // 複製數據
          app.globalData.userInfoInput = signUpUserInfoInput;
          this.setData({  userInfoInput : signUpUserInfoInput  });
          console.log("自動刷新本頁");
          this.onLoad();
        }
        else {    // 未註冊，拉取雲端的empty數據模板
          db.collection('config').where({
            userInfoInput_empty : {shortName:"name"},
          }) .get() .then(res =>{
            let userCloudData = res.data[0];
// 拉取empty數據 - 雲端 → 本地&全局
            let emptyUserInfoInput = JSON.parse(JSON.stringify(userCloudData.userInfoInput_empty));  // 複製數據
            app.globalData.userInfoInput_empty = emptyUserInfoInput;
            this.setData({  // 更新本地userInfo模板
              userInfoInput_empty : emptyUserInfoInput,
              userInfoInput       : emptyUserInfoInput,
            });
          })
          Dialog.confirm({  // 提示註冊
            title: '系統提示',
            message: '現在填寫必要資料 (完成註冊) 嗎',
          })
            .then(() => {   // 進入編輯mode
              // on confirm
              this.setData({  bindEditMode : true  });  
            })
            .catch(() => {  // 非編輯mode
              // on cancel
              this.setData({  bindEditMode : false  }); 
              Notify({ type: 'warning', message: '現在仍不是正式成員喔' });
            });
        }
      }) .catch(err => {    console.log(err);    });

      // 登錄後不再按鈕請求登錄（保存用戶頭像等信息） - 未完成
      this.setData({
        canIUseOpenData : true ,
      })

    })// 同意登錄 - end
    // .then(res=>{  // 重新載入本頁
    //   console.log("自動刷新本頁");
    //   this.onLoad();
    // })
    .catch(err=>{                      // 拒絕登錄
      console.log("用戶點擊拒絕：",err);
      Notify({ type: 'warning', duration: 3500, message: '登錄失敗QAQ' });
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
    // 輸入值的校驗規則
    let idError =     !this.data.UM_ID_input        || !!this.data.umIdError;
    let nameError =   !this.data.studentName_input  || !!this.data.nameError;
    idError =         idError   || (this.data.UM_ID_input        == this.data.userInfoInput_empty.find(o => o.shortName === 'umId').input);
    nameError =       nameError || (this.data.studentName_input  == this.data.userInfoInput_empty.find(o => o.shortName === 'name').input);
    let majorError =  (this.data.studentMajor_input == this.data.userInfoInput_empty.find(o => o.shortName === 'studentMajor').input);
    let yearError =   (this.data.studentYear_input  == this.data.userInfoInput_empty.find(o => o.shortName === 'studentYear').input);

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
      // 先把輸入寫入當前js的userInfoInput
      let w0 = this.data.userInfoInput.findIndex(o=> o.shortName === 'umId' );    // 1
      let w1 = this.data.userInfoInput.findIndex(o=> o.shortName === 'name' );
      let w2 = this.data.userInfoInput.findIndex(o=> o.shortName === 'studentMajor' );
      let w3 = this.data.userInfoInput.findIndex(o=> o.shortName === 'studentYear' );
      that.setData({        // 寫入當前js的userInfoInput數據，setData寫法可以保證展示頁刷新
        bindEditMode : false,
        ['userInfoInput['+w0+'].input'] : that.data.UM_ID_input,
        ['userInfoInput['+w1+'].input'] : that.data.studentName_input,
        ['userInfoInput['+w2+'].input'] : that.data.studentMajor_input,
        ['userInfoInput['+w2+'].majorTag'] : that.data.studentMajorTag_input,
        ['userInfoInput['+w3+'].input'] : that.data.studentYear_input,
      });
      
// if 本地註冊狀態為false（新用戶），能執行此條件的為正確輸入，因此寫入本地註冊時間和ARKid
      if (!that.data.userInfoInput[that.data.userInfoInput_isSignUpIndex].input) {
        this.userSignUp();  // 向數據庫新增用戶
      }
      // 上傳數據 本地 → 雲端
      // 轉化為字符串才能對比數組
      console.log("app的數據為",app.globalData.userInfoInput);
      console.log("本js的數據為",that.data.userInfoInput);
      if ( JSON.stringify(app.globalData.userInfoInput) == JSON.stringify(that.data.userInfoInput) ) {
        console.log("完全沒有修改呢！");
      }
      else {    // 本地 → 雲端，更新數組
        console.log("有修改！Update！");
        app.globalData.userInfoInput = JSON.parse(JSON.stringify(that.data.userInfoInput));
        this.userInfoUpdate(that);  // 向數據庫更新用戶的信息
        this.findSetData(this.data.shortNameArray);
      }
      // this.onLoad();
      Notify({ type: 'success', message: '修改成功！建議使用下拉刷新頁面喔！' });
    }// 輸入符合條件的else - end
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
  // 調用雲函數, 新增用戶
  userSignUp() {
      let that = this;
      let wTime = that.data.userInfoInput.findIndex(o=> o.shortName === 'signUpTime' );
      let writeTime = 'userInfoInput['+wTime+'].input';
      that.setData({  [writeTime] : that.data.today,  })
      // ARKid - 未完成
      // 修改本地註冊狀態為 true
      that.data.userInfoInput[that.data.userInfoInput_isSignUpIndex].input = true;
      app.globalData.userInfoInput = JSON.parse(JSON.stringify(that.data.userInfoInput));

      //調用雲函數 userSignUp 完成數據上傳
      wx.cloud.callFunction({ 
        name: 'userSignUp',
        data:{
            avatarUrl     : this.data.userInfo.avatarUrl,
            nickName      : this.data.userInfo.nickName,
            gender        : this.data.userInfo.gender,        // 1：男        2：女
            userInfoInput : this.data.userInfoInput,
        }
      }) .catch(err=>{  console.error(err);  })
  },
  // 用戶資料更新
  userInfoUpdate(that) {
    wx.cloud.callFunction({ //調用雲函數 userSignUp 完成數據上傳
      name: 'userInfoUpdate',
      data:{
          avatarUrl     : that.data.userInfo.avatarUrl,
          nickName      : that.data.userInfo.nickName,
          userInfoInput : that.data.userInfoInput,
      }
    }) .catch(err=>{  console.error(err);  })
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
    // console.log("Today is",today);
    let durationDay_sem = (new Date(this.data.semFinishDay).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay_sem,
      today
    })
    // console.log("今天離全局設置的完sem日還有：",durationDay_sem,"天");
    let durationDay_Grudate = (new Date(this.calcGraduateDay(Y)).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({  durationDay_Grudate  })

    // 計算距離畢業progress進度條比值
    if (this.data.durationDay_Grudate) {
      // console.log("durationDay_Grudate為",this.data.durationDay_Grudate);
      // console.log("總上學時長為",(365*4 -4-31-31-8));
      let durationDay_Grudate_progress = 100-Math.round(this.data.durationDay_Grudate / (365*4 -4-31-31-8) *100);
      this.setData({
        durationDay_Grudate_progress
      })
      // console.log("durationDay_Grudate_progress為(目前過了)",this.data.durationDay_Grudate_progress,'%');
    }
  },
  calcGraduateDay (today_Year){
    let studentYear_inputFun = this.data.userInfoInput[this.data.userInfoInput_studentYearIndex].input;
    let studentYearFun = JSON.parse(JSON.stringify(this.data.studentYear));
    // 在該數組開頭插入，empty數組的空輸入
    studentYearFun.unshift(this.data.userInfoInput_empty.find(o=> o.shortName== "studentYear").input );
    let studentYearIndexFun = studentYearFun.findIndex(o=> o== studentYear_inputFun);

    if (studentYearIndexFun != 0) {
      console.log("畢業日期為",today_Year+(4-studentYearIndexFun)+'/'+'06'+'/'+'23');
      return(today_Year+(4-studentYearIndexFun)+'/'+'06'+'/'+'23');
    }
  },

  // 跳轉 協議 頁
  jumpToProtocol () {
    wx.navigateTo({
      url: '../protocol/protocol',
    })
  },

})