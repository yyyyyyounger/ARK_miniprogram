var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var cloudData = require('../../data/cloud.js')
const db = wx.cloud.database();   // 數據庫

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

const userCloudDataStorage = wx.getStorageSync('userCloudData');

Page({
  data: {
    // 骨架屏
    loading:true,
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
    // canIUseGetUserProfile: false,
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

    // 向服務器請求的延時動畫
    Toast.loading({
      message: '拼命加載中...',
      forbidClick: true,
    });

    // 獲取緩存，打開小程序時就會判斷是否有頭像緩存，然後寫入globalData.isSignIn
    const userInfoStorage = wx.getStorageSync('userInfo');
    if (app.globalData.isSignIn) {      // 全局已登錄，已註冊用戶
      this.setData({
        userInfo: userInfoStorage.data, // 用戶暱稱、頭像數據
        hasUserInfo: true,      // 已獲取用戶信息
        isSignIn:true           // 成功登錄後，局部isSignIn → true：用戶已登錄
      })
      var needWait = true;
    }

    // 定義控制台log的部分字段
    var consoleMeg = '';

// 拉取本地cloudData的模擬數據(複製) - userInfoInput - 雲端 → 本地
    let arrayEmpty = JSON.parse(JSON.stringify(cloudData.userInfoInput_empty));
    this.setData({  
      userInfoInput       : arrayEmpty,
      userInfoInput_empty : arrayEmpty,
    });
    if (!this.data.isSignIn) {              // if 未登錄，則 複製cloudData.js的空數據 → 本地
      consoleMeg = '未登錄 - ';
      Toast('快快註冊吧！');    // 提示註冊
      console.log(consoleMeg+'當前js的userInfo為',this.data.userInfoInput); 
  
      // 初始化各種數組
      this.ArrayDataInit(this);

      this.setData({  loading: false  });   // 頁面加載完成時，取消骨架屏
    }
    else {                                  // if 已登錄，歡迎語
      Toast.loading({
        message: '請稍等...',
        forbidClick: true,
      })
      // 返回majorTagArray的信息
      this.returnMajorTagArray(this);
      // 如果存在userInfo的緩存，則先渲染著，再請求雲端返回
      if (userCloudDataStorage) {
        this.setData({  userInfoInput : userCloudDataStorage.data.userInfoInput  })
      }

      getUserCloudData().then(res => {  // 鏈式調用，雲端返回用戶登記的數據
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
          // 設置緩存
          wx.setStorageSync('userCloudData', {time:Date.now(), data:userCloudData})
          // 個性化歡迎語
          let userNameInput = this.data.userInfoInput.find(o => o.shortName === 'name');   // 查找用戶修改的姓名
          Toast('Dear '+userNameInput.input+' , Welcome Back ~\n              []~(￣▽￣)~*');    // 個性化歡迎語  
        }
        else{                                           // 未註冊，提示註冊
          Toast('請盡快前往個人信息頁完成註冊喔 !');
        }
      }) 
      .then(()=>{
        console.log(consoleMeg+'當前js的userInfo為',this.data.userInfoInput); 
  
        // 初始化各種數組
        this.ArrayDataInit(this);
        this.setData({  loading: false  });   // 頁面加載完成時，取消骨架屏
      })
      .catch(err => {    console.log(err);    });

      consoleMeg = '已登錄 - ';
    }

    // 未理解的神秘執行(必須存在) - 未完成
    // if (wx.getUserProfile) {
    //   console.log("wx.getUserProfile為true");
    //   this.setData({
    //     // 用戶授權狀態設為true
    //     canIUseGetUserProfile: true
    //   })
    // } else{  console.log("user頁 - onLoad() - GetuserProfile ***fail***"); }
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
    })
  },
  // 初始化各種數組
  ArrayDataInit(that) {
    // 生成 無input版 userInfo的shortName數組
    let shortNameArray =    that.data.userInfoInput.map((item)=>{    return item.shortName   });
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = that.data.userInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = that.data.userInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    that.setData({    InfoDisplay, canEdit, shortNameArray    });
    // 初始化所有index值
    that.findSetData(that.data.shortNameArray);
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
    this.setData({  bindEditMode:false  })
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
          console.error(err);
          reject(err);
        })
      });
    };
    // 返回majorTagArray的信息
    this.returnMajorTagArray(this);

    getUserProfilePro().then(res=>{    // 同意登錄
      Notify({ type: 'success', message: '登錄成功！' });
      this.setData({
        userInfo: res.userInfo, // 用戶暱稱、頭像數據
        hasUserInfo: true,      // 已獲取用戶信息
        isSignIn:true           // 成功登錄後，局部isSignIn → true：用戶已登錄
      })

      Toast.loading('稍等')

      // 設置userInfo帶時間的緩存
      wx.setStorageSync('userInfo', {time:Date.now() ,data:this.data.userInfo});

      // 成功登錄後，局部 → 全局isSignIn → true
      app.globalData.isSignIn = true;

      // 登錄成功後，判斷是否已註冊 - 數據庫是否存在該用戶openid（查找_id）
      getUserCloudData().then(res => {    // 鏈式調用，能在該鏈上使用該userCloudData的返回值
        console.log("鏈式調用getUserCloudData，返回數組長度為：",res.result.userCloudData.data.length)
        Toast.loading('稍等')
        if (res.result.userCloudData.data.length!=0) {  // 已註冊，將 數據庫user數據複製 → 本地&全局
          let userCloudData = res.result.userCloudData.data[0];
          const userInfoStorage = wx.getStorageSync('userInfo');  // 用戶頭像緩存
          if (userCloudData.avatarUrl!=userInfoStorage.data.avatarUrl || userCloudData.nickName!=userInfoStorage.data.nickName) {   // 如果用戶已更新自己的頭像
            // 更新頭像和暱稱
            db.collection('user').where({  arkid : userCloudData.arkid  }).update({
              data: {
                avatarUrl : userInfoStorage.data.avatarUrl,
                nickName  : userInfoStorage.data.nickName,
              }
            }) .then(res=>{  console.log(res);  }) .catch(err=>{  console.error(err);  })
          }
// 拉取user數據 - 雲端 → 本地&全局，緩存
          let signUpUserInfoInput = JSON.parse(JSON.stringify(userCloudData.userInfoInput));  // 複製數據
          app.globalData.userInfoInput = signUpUserInfoInput;
          // 將userInfoInput寫入緩存
          wx.setStorageSync('userCloudData', {time:Date.now() ,data:userCloudData});
          console.log("已經設置好userCloudData緩存");
          this.setData({  userInfoInput : signUpUserInfoInput  });
          // 更新顯示的內容
          this.findSetData(this.data.shortNameArray);
          this.calcTime();
        }
        else {    // 未註冊，拉取雲端的empty數據模板
          // 拉取空數據模板
          this.returnUserInfoEmpty(this); 

          Dialog.confirm({  // 提示註冊
            title: '系統提示',
            message: '現在填寫必要資料 (完成註冊) 嗎',
            zIndex:99999999,
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
        } // else - end
      }) 
      .then(res=>{
        // 登錄後不再按鈕請求登錄（保存用戶頭像等信息） - 未完成
        this.setData({
          canIUseOpenData : true ,
        })
      })
      .then(res=>{
        console.log("進行重啟頁面");
        Toast.loading('稍等');
        wx.reLaunch({
          url: './user',
        })
      })
      .catch(err => {    console.log(err);    });

    })// 同意登錄 - end
    .catch(err=>{                      // 拒絕登錄
      console.error("用戶點擊拒絕：",err);
      Notify({ type: 'warning', duration: 3500, message: '登錄失敗QAQ' });
    })

  },
  // 返回數據庫中新的majorTagArray
  returnMajorTagArray (that) {
    // 21/09/11修改為用本地方式訪問該數據
    that.setData({
      majorTagArray : cloudData.majorTagArray, 
      studentMajor  : cloudData.studentMajor, 
    })
    // 抽取數組元素 插入major選項數組
    let studentMajorArray = [];
    for (let i = 0; i < that.data.studentMajor.length; i++) { 
      let studentMajorObj = {};
      studentMajorObj.name = that.data.studentMajor[i];
      studentMajorArray.push(studentMajorObj)
    }
    that.setData({  actions_sheet_major:studentMajorArray  })
  },
  // 返回數據庫config集合中最新的 empty 模板數據
  returnUserInfoEmpty (that) {
    db.collection('config').where({
      userInfoInput_empty : {shortName:"name"},
    }) .get() .then(res =>{
      let userCloudData = res.data[0];
// 拉取empty數據 - 雲端 → 本地&全局
      let emptyUserInfoInput = JSON.parse(JSON.stringify(userCloudData.userInfoInput_empty));  // 複製數據
      app.globalData.userInfoInput_empty = emptyUserInfoInput;
      that.setData({  // 更新本地userInfo模板
        userInfoInput_empty : emptyUserInfoInput,
        userInfoInput       : emptyUserInfoInput,
      });
    })
  },

  // 不彈出彈窗，直接返回匿名用戶信息
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
        ['userInfoInput['+w0+'].input']     : that.data.UM_ID_input,
        ['userInfoInput['+w1+'].input']     : that.data.studentName_input,
        ['userInfoInput['+w2+'].input']     : that.data.studentMajor_input,
        ['userInfoInput['+w2+'].majorTag']  : that.data.studentMajorTag_input,
        ['userInfoInput['+w3+'].input']     : that.data.studentYear_input,
      })
      
// if 本地註冊狀態為false（新用戶），註冊邏輯。能執行此條件的為正確輸入，因此寫入本地註冊時間和ARKid
      if (!that.data.userInfoInput[that.data.userInfoInput_isSignUpIndex].input) {
        // 閱讀ARK協議 - 未完成
        // 同意ARK協議後則允許新增用戶
        // 展示ARK協議
        this.setData({  show_dialog:true  })
      }
// if 已註冊用戶，為更新個人信息邏輯
      else {
        // 上傳數據 本地 → 雲端
        // 轉化為字符串才能對比數組
        console.log("app的數據為",app.globalData.userInfoInput);
        console.log("本js的數據為",that.data.userInfoInput);
        if ( JSON.stringify(app.globalData.userInfoInput) == JSON.stringify(that.data.userInfoInput) ) {
          Notify({ type: 'primary', message: '完全沒有修改呢！' });
          console.log("完全沒有修改呢！");
        }
        else {    // 本地 → 雲端，更新數組
          Notify({ type: 'primary', message: '有修改！Update！' });
          console.log("有修改！Update！");
          this.userInfoUpdate(that);  // 向數據庫更新用戶的信息
          this.findSetData(this.data.shortNameArray);
        }
      }
      // this.onLoad();
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
  // 檢查是否 2分鐘內多於3次請求操作數據庫，檢查操作頻繁程度
  callCloudCheck () {
    let timeNow = Date.now();  // 希望請求更新數據的時間(當前)
    const callCloudStorage = wx.getStorageSync('callCloud');
    if (!callCloudStorage) {    // 如果記錄操作次數的緩存不存在，則創建
      wx.setStorageSync('callCloud', {editTime:timeNow, callCloudTimes:1})  // 記錄時間，已操作過 1次
      return true;              // 允許通信
    }
    else if ( (timeNow-callCloudStorage.editTime)>(2*60*1000) ) { // 如果上一次操作已經等待超過2分鐘
      wx.setStorageSync('callCloud', {editTime:timeNow, callCloudTimes:1}) // 重設記錄時間，已操作過 1次
      return true;
    }
    else if (callCloudStorage.callCloudTimes < 3) {
      wx.setStorageSync('callCloud', {
        editTime:callCloudStorage.editTime,
        callCloudTimes:callCloudStorage.callCloudTimes+1    // 操作次數+1
      }) 
      return true;
    }
    else {
      return false;
    }
  },

  // 調用雲函數, 新增用戶 - 2021.8.8改為在協議頁protocol signUp，該頁面該函數棄用
  userSignUp() {
    let that = this;
    that.getNowTime();    // 獲取現時時間
    let wTime = that.data.userInfoInput.findIndex(o=> o.shortName === 'signUpTime' );
    that.setData({  ['userInfoInput['+wTime+'].input'] : that.data.today,  })
    // 修改本地註冊狀態為 true
    that.data.userInfoInput[that.data.userInfoInput_isSignUpIndex].input = true;
    app.globalData.userInfoInput = JSON.parse(JSON.stringify(that.data.userInfoInput));

    //調用雲函數 userSignUp 完成數據上傳
    wx.cloud.callFunction({
      name: 'userSignUp',
      data:{
          avatarUrl     : that.data.userInfo.avatarUrl,
          nickName      : that.data.userInfo.nickName,
          gender        : that.data.userInfo.gender,        // 1：男        2：女
          userInfoInput : that.data.userInfoInput,
      }
    }) .catch(err=>{  console.error(err);  })
  },
  // 用戶資料更新
  userInfoUpdate(that) {
    Toast.loading({ // 加載提示
      message: '瘋狂請求中...',
      forbidClick: true,
    });
    let callCloudTimes = that.callCloudCheck();
    if (callCloudTimes) {
      wx.cloud.callFunction({ //調用雲函數 userInfoUpdate 完成數據上傳
        name: 'userInfoUpdate',
        data:{
            avatarUrl     : that.data.userInfo.avatarUrl,
            nickName      : that.data.userInfo.nickName,
            userInfoInput : that.data.userInfoInput,
        }
      }) .then(res=>{
        app.globalData.userInfoInput = JSON.parse(JSON.stringify(that.data.userInfoInput));
        // 即時修改緩存數據
        let userCloudDataStorage = wx.getStorageSync('userCloudData')
        userCloudDataStorage.data.userInfoInput = that.data.userInfoInput;
        wx.setStorageSync('userCloudData',{ data:userCloudDataStorage.data, time:Date.now() } )
        Notify({ type: 'success', message: '修改成功！若有延遲請下拉刷新頁面喔！' });
      }).catch(err=>{  console.error(err);  })
    }
    else {
      Notify({ type: 'warning', message: '未上傳！請求過於頻繁，請稍後再來吧！' });
    }
  },

  // 獲取現時時間
  getNowTime(){
    // 獲取當前時間軸
    var timestamp = Date.now();
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let today = Y+'/'+M+'/'+D;
    this.setData({ today })
  },

  calcTime (){
    // 獲取當前時間軸
    var timestamp = Date.now();
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let today = Y+'/'+M+'/'+D;
    let durationDay_sem = (new Date(this.data.semFinishDay).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({
      durationDay_sem,
      today
    })
    let durationDay_Grudate = (new Date(this.calcGraduateDay(Y)).getTime() - new Date(today).getTime()) / (1000 * 60 * 60*24);
    this.setData({  durationDay_Grudate  })

    // 計算距離畢業progress進度條比值
    if (this.data.durationDay_Grudate) {
      let durationDay_Grudate_progress = 100-Math.round(this.data.durationDay_Grudate / (365*4 -4-31-31-8) *100);
      this.setData({
        durationDay_Grudate_progress
      })
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

  // 跳轉 協議 頁  -  增加帶參跳轉，若為正在註冊的用戶，參數為signUp
  jumpToProtocol (e) {
    this.setData({  show_dialog:false  })
    let mode = e.currentTarget.dataset.mode;
    if (mode) {
      let userInfoStorage = wx.getStorageSync('userInfo').data;
      console.log("跳轉協議頁模式為",mode);
      // 跳轉課程詳情頁
      let detailInfo = {
        mode          : mode,
        userInfoInput : this.data.userInfoInput,
        userInfo      : userInfoStorage,
      }
      detailInfo = JSON.stringify(detailInfo);
      wx.navigateTo({
        url: '../protocol/protocol?detailInfo=' + detailInfo,
      })
    }
    else {          // 無參數模式跳轉
      wx.navigateTo({
        url: '../protocol/protocol',
      })
    }
  },

})