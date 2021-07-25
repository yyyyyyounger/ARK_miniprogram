var app = getApp();
const { userInfoInput } = require('../../../data/cloud.js');
var cloudData = require('../../../data/cloud.js')
const db = wx.cloud.database();   // 數據庫

const getCourseInfoArray = () => {    // 新增promise，抓取所調用雲函數的返回值，準備鏈式調用
  return new Promise((resolve, reject) => {
    db.collection('config') .doc("courseInfoArray") .get() 
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
    // helperInfoArray
    helperInfoArray : [],
    // 允許投票
    allowVote:false,
    // 日期選擇器
    date: '',
    show_calendar: false,
    minDate_calendar: new Date(2021, 7, 1).getTime(),
    maxDate_calendar: new Date(2021, 7, 31).getTime(),
    // 日期選擇器 - end
    // 時間選擇器
    currentDate: '12:00',
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }

      return options;
    },
    // 時間選擇器 - end
    basics: 0,
    numList: [{
      name: '填寫信息'
      }, {
        name: '提交管理員審核'
      }, {
        name: '課程發佈'
      }, 
    ],
    num: 0,
    scroll: 0,

    ColorList: [
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    ],
  },
  //options(Object)
  onLoad: function(){
    getCourseInfoArray().then(res => {
      // console.log(res.data.courseInfo_empty);

      // 複製雲端數組
      let arrayEmpty = JSON.parse(JSON.stringify( res.data.courseInfo_empty ));
      this.setData({  courseInfoInput : arrayEmpty  });
      // 生成簡易版(無input版)userInfo的shortName數組
      let shortNameArray =    this.data.courseInfoInput.map((item)=>{    return item.shortName   });

      // 初始化所有index
      this.findSetData(shortNameArray);

    }) .catch(err => {
      let arrayEmpty = JSON.parse(JSON.stringify(cloudData.courseInfo_empty));
      console.error(err);
    })
    
  },
  findSetData(shortNameArray) { // 初始化所有index，匹配對應input值用於顯示
    this.setData({
      courseInfoInput_courseIdIndex       : shortNameArray.findIndex(o=> o== "courseId"),
      courseInfoInput_courseNameIndex     : shortNameArray.findIndex(o=> o== "courseName"),
      courseInfoInput_courseContentIndex  : shortNameArray.findIndex(o=> o== "courseContent"),
      courseInfoInput_courseTagIndex      : shortNameArray.findIndex(o=> o== "courseTag"),
      courseInfoInput_courseAdresIndex    : shortNameArray.findIndex(o=> o== "courseAdres"),
      courseInfoInput_courseTimeIndex     : shortNameArray.findIndex(o=> o== "courseTime"),
      courseInfoInput_speakerNameIndex    : shortNameArray.findIndex(o=> o== "speakerName"),
      courseInfoInput_speakeridIndex      : shortNameArray.findIndex(o=> o== "speakerid"),
      courseInfoInput_helperNameIndex     : shortNameArray.findIndex(o=> o== "helperName"),
      courseInfoInput_helperidIndex       : shortNameArray.findIndex(o=> o== "helperid"),
      courseInfoInput_helperAvatarIndex   : shortNameArray.findIndex(o=> o== "helperAvatar"),
      courseInfoInput_followersIndex      : shortNameArray.findIndex(o=> o== "followers"),
      courseInfoInput_courseStateIndex    : shortNameArray.findIndex(o=> o== "courseState"),
      courseInfoInput_courseStarsIndex    : shortNameArray.findIndex(o=> o== "courseStars"),
      courseInfoInput_attendCodeIndex     : shortNameArray.findIndex(o=> o== "attendCode"),
    })
  },
  onReady: function(){
    
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onPullDownRefresh: function(){

  },

  // 步驟條
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  // 下一步 - 按鈕觸發
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },

// 允許投票switch的開關
  onChange_Switch(){
    this.setData({  allowVote:!this.data.allowVote  })
  },
// 日期選擇器
  onDisplay_date() {
    this.setData({ show_calendar: true });
  },
  onClose() {
    this.setData({ 
      show_calendar: false,
      show_timePicker: false
    });
  },
  formatDate(date) {    // 日期選擇器確認後獲取 選取的值
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm_calendar(event) {
    console.log(event);
    this.setData({
      show_calendar: false,
    });

    if (this.data.allowVote) {    // 投票mode 設定聽者投票範圍
      let datePickStr = "";
      let datePickArray = [];
      for (let i = 0; i < event.detail.length; i++) {
        console.log(  this.formatDate((event.detail[i]))  );
        datePickArray.push(  this.formatDate((event.detail[i]))  );
        datePickStr += this.formatDate((event.detail[i]))+", ";
      }
      datePickArray.sort(function(a, b){
        return a > b ? 1 : -1; // 这里改为大于号
      });
      console.log("日期選擇的數組形式",datePickArray);
      console.log("日期選擇的字符串形式",datePickStr);
      this.setData({  
        datePick: datePickStr,
        datePickArray,
      })
    } 
    else {                        // 講者設定日期mode
      this.setData({  datePick: this.formatDate( event.detail ),  })
      console.log(this.data.datePick);    // datePick為 yyyy/m/d格式
    }

  },
// 日期選擇器 - end
// 時間選擇器
  onDisplay_time() {
    this.setData({ show_timePicker: true });
  },
  onCancel_timerPicker () {
    this.setData({ show_timePicker: false });
  },
  handleTimePicker(e) {
    console.log(e.detail);
    this.setData({ 
      show_timePicker: false, 
      timePick : e.detail
    });
  },
// 輸入框匯總監聽
  onChange_field(e) {
    let userInputValue = e.detail;
    let userInputType = e.currentTarget.dataset.model;
    if (userInputType=="attendCode_input") {
      // 簽到密碼的字母不區分大小寫
      this.setData({    [userInputType]: userInputValue.toUpperCase()    });
    }
    else {
      // 输入监听，該方法可以多個input綁定同一個函數
      this.setData({    [userInputType]: userInputValue    });
    }
  },
// 提交 / 退出 按鈕綁定事件
  onClick_saveSubmit (e) {
    let userClickType = e.currentTarget.dataset.model;
    this.setData({    [userClickType]: true    });
    if (this.data.btn_quit) {   // 點擊了保存並退出按鈕
      // 已輸入的數據保存到本地 - 未完成
      wx.navigateBack({    delta: 0,   })   // 回退上一頁
    }
    if (this.data.btn_submit) { // 點擊了保存並上傳按鈕
      console.log("用戶請求submit");
// 如數據無誤，提交到雲端，管理員端提示 - 未完成
      // 寫入當前js的courseInfoInput數據，缺helper、講師等數據寫入 - 未完成
      this.setData({        
        bindEditMode : false,
        ['courseInfoInput['+this.data.courseInfoInput_courseNameIndex+'].input']    : this.data.courseName_input,
        ['courseInfoInput['+this.data.courseInfoInput_courseContentIndex+'].input'] : this.data.courseContent_input,
        ['courseInfoInput['+this.data.courseInfoInput_courseAdresIndex+'].input']   : this.data.courseAdres_input,
        ['courseInfoInput['+this.data.courseInfoInput_courseTimeIndex+'].input[0]'] : this.data.datePick,
        ['courseInfoInput['+this.data.courseInfoInput_courseTimeIndex+'].input[1]'] : this.data.timePick,
      })
      // 上傳數據 本地 → 雲端 - 未完成
      const userInfoStorage = wx.getStorageSync('userInfo');
      // wx.cloud.callFunction({   // 調用加課的雲函數 courseAdd
      //   name : 'courseAdd',
      //   data : {
      //     courseInfoInput : this.data.courseInfoInput ,
      //     avatarUrl       : userInfoStorage.data.avatarUrl,
      //     nickName        : userInfoStorage.data.nickName,
      //     allowVote       : this.data.allowVote,
      //     datePickArray   : this.data.datePickArray,
      //   }
      // }) .then (res=>{
      //   console.log(res);
      // }) .catch (err=>{
      //   console.error(err);
      // })
    } // if點擊了submit button - end
  },

  // 選填區
  // 選擇helper - 確認按鈕
  confirmHelper() {
    // 1 數據庫查詢 arkid 是否存在
      // 存在，返回頭像，寫入本地js的helper數據
      // 不存在，提示不存在
    const searchArkid = () => {    // 新增promise，抓取所調用雲函數的返回值，準備鏈式調用
      return new Promise((resolve, reject) => {
        db.collection('user') .where({
          arkid : parseInt(this.data.helperid_input),   // 需要轉為數字再查詢
        }) .field({
          avatarUrl : true,
          userInfoInput :true,
        }) .get() 
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

    if (this.data.helperInfoArray.length<2) {   // Helper數未滿
      if (this.data.helperid_input == userCloudDataStorage.data.arkid ) {    // 如果搜索的是自己，提示不可以
        console.log("Helper不能是自己！");  // 缺面板提示 - 未完成
      } else if ( this.data.helperInfoArray[0] && this.data.helperInfoArray[0].arkid==this.data.helperid_input) {
        console.log("第二位Helper不能是同一個人！");
      } else {                      // 搜索的是別人，允許，但每天只有3次機會添加 - 提示，未完成
        // 詢問是否確認添加，一旦確認，不能更改
        searchArkid().then(res => {
          if (res.data.length!=0) {  // 用戶存在
            console.log("該用戶存在！");
            console.log("數據為：",res.data[0]);
            let helperName  = res.data[0].userInfoInput[1].input;
            console.log("HelperName為：",helperName);
            let helperInfoObj = {
              name    : helperName,
              Avatar  : res.data[0].avatarUrl,
              arkid   : this.data.helperid_input,
            }
            let arrayTemp = this.data.helperInfoArray;    // 曲線插入data中，先引用，再push，再setData
            arrayTemp.push(helperInfoObj);
  
            this.setData({
              helperInfoArray : arrayTemp,
              helperAvatarUrl : res.data[0].avatarUrl,
              helperName,
              displayHelper   : true,   // wxml顯示helper頭像
            })
          } else {  // 用戶不存在
            console.log("該用戶不存在，請協商或反饋！");
          }
        }) .catch(err=>{  console.error(err);  })
      }
    } else {                                    // Helper數已滿（2人）
      console.log("Helper數已滿！不能再添加");
    }

  },
});