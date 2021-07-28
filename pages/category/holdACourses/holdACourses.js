var app = getApp();
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

const { userInfoInput, courseInfoInput } = require('../../../data/cloud.js');
var cloudData = require('../../../data/cloud.js')
const db = wx.cloud.database();   // 數據庫
const userInfoStorage = wx.getStorage('userInfo');  // 用戶緩存
const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存

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
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 5 === 0);
      }

      return options;
    },
    timePickArray:[],
    // 時間選擇器 - end
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
    
    for (let i = 0; i < 4; i++) {
      this.data.timePickArray.push({begin:'',end:''})
    }
    if (!this.data.allowVote) {
      this.data.timePickArray.splice(0,3);
    }
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
      courseInfoInput_helperIndex         : shortNameArray.findIndex(o=> o== "helper"),
      courseInfoInput_followersIndex      : shortNameArray.findIndex(o=> o== "followers"),
      courseInfoInput_courseStateIndex    : shortNameArray.findIndex(o=> o== "courseState"),
      courseInfoInput_courseStarsIndex    : shortNameArray.findIndex(o=> o== "courseStars"),
      courseInfoInput_attendCodeIndex     : shortNameArray.findIndex(o=> o== "attendCode"),
    })
  },

  onShow: function(){
    
  },
  onHide: function(){

  },
  onPullDownRefresh: function(){

  },

// 允許投票switch的開關
  onChange_Switch(){
    this.setData({    // 清空之前的選擇
      allowVote     :!this.data.allowVote,
      datePick      : '',
      datePickArray : '',
      datePickStr   : '',
      timePick      : '',
      timePickStr   : '',
    })
    let timePickArr = this.data.timePickArray;
    timePickArr.splice(0,3);
    for (let i = 0; i < 4; i++) {
      timePickArr.push({begin:'',end:''})
    }
    if (!this.data.allowVote) {
      timePickArr.splice(0,3);
    }
    this.setData({  timePickArray:timePickArr  })
    console.log("timePickArray為",timePickArr);
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
    console.log(event.detail);
    this.setData({ show_calendar: false, });

    if (this.data.allowVote && event.detail.length>4) {
      Notify({ type: 'warning', message: '最多設置4個投票日期！' });
    }
    if (this.data.allowVote && event.detail.length<=4) {    // 投票mode 設定聽者投票範圍
      let datePickStr = "";
      let datePickArray = [];
      for (let i = 0; i < event.detail.length; i++) {
        console.log(  this.formatDate((event.detail[i]))  );
        datePickArray.push(  this.formatDate((event.detail[i]))  );
        // datePickStr += this.formatDate((event.detail[i]))+", ";
      }
      datePickArray.sort(function(a, b){
        return a > b ? 1 : -1; // 这里改为大于号
      });
      for (let i = 0; i < datePickArray.length; i++) {
        datePickStr += datePickArray[i]+", ";
      }
      console.log("日期選擇的數組形式",datePickArray);
      console.log("日期選擇的字符串形式",datePickStr);
      this.setData({  
        datePick: datePickStr,
        datePickArray,
      })
      Notify({ type: 'success', message: '投票日期設定成功！（ '+event.detail.length+' / 4 ）' });  
    } 
    else if (!this.data.allowVote) {                 // 講者設定日期mode
      this.setData({  datePick: this.formatDate( event.detail ),  })
      console.log(this.data.datePick);    // datePick為 yyyy/m/d格式
    }

  },
// 日期選擇器 - end
// 時間選擇器
  onDisplay_time(e) {
    this.setData({ 
      show_timePicker : true,
      timePickModel   : e.currentTarget.dataset.model,    // 用於判斷 當前選擇為begin還是end時間
    });
  },
  onCancel_timerPicker () {
    this.setData({ show_timePicker: false });
  },
  handleTimePicker(e) {
    console.log("選擇的時間：",e.detail);
    let timePick = e.detail;

    if (this.data.allowVote) {    // 投票mode
      // 獲取當前目標輸入的數據的索引，if [0]輸滿了，則開始判斷[1]
      for (let i = 0; i < this.data.timePickArray.length; i++) {
        if ( !this.data.timePickArray[i].end || !this.data.timePickArray[i].begin ) {
          this.setData({  timePickArrayLength : i  })
          break
        }
      }
      console.log("timePickArray的目標索引為：",this.data.timePickArrayLength);
      let arrLength = this.data.timePickArrayLength;  // 當前目標的索引
  
      // 判斷狀態
      let writeBeginFirst = !(!this.data.timePickArray[arrLength].begin && this.data.timePickModel=='end');
      let noSameInput     = !(timePick==this.data.timePickArray[arrLength].begin || timePick==this.data.timePickArray[arrLength].end);
      let noEarlyBegin    = !(e.detail < this.data.timePickArray[arrLength].begin);
  
      if ( !writeBeginFirst ) {  // 請先輸入開始時間
        Notify({ type: 'warning', message: '請先輸入開始時間！' });  
      }
      if ( !noSameInput ) {      // 兩次輸入不能相同
        Notify({ type: 'warning', message: '兩次輸入不能相同！' });  
      }
      if ( !noEarlyBegin ) {      // End比Begin早
        Notify({ type: 'warning', message: '結束時間不能比開始時間早！' });  
      }
      if (writeBeginFirst && noSameInput && noEarlyBegin && arrLength < 4) { // 將輸入的數據寫入timePickArray
        let model = this.data.timePickModel;
        this.setData({  ['timePickArray['+arrLength+'].'+model] : timePick  })
        console.log(this.data.timePickArray[arrLength]);
      }
      if ( arrLength==3 && this.data.timePickArray[arrLength].begin && timePick==this.data.timePickArray[arrLength].end ) {        // 只能添加最多 4 個時間段
        Notify({ type: 'warning', message: '只能添加最多 4 個時間段！' });
      }
      for (let i = 0; i < this.data.timePickArray.length; i++) {    // 判斷有無相同時間段的輸入
        for (let j = i+1; j < this.data.timePickArray.length; j++) {
          if ( JSON.stringify(this.data.timePickArray[i]) == JSON.stringify(this.data.timePickArray[j]) ) {
            if (!this.data.timePickArray[i].begin || !this.data.timePickArray[j].begin) {   // 如果i或j都不存在，沒有對比意義
              break
            }
            console.log("timePickArray第",i,"與第",j,"項相同！");
            console.log("刪除",this.data.timePickArray[j]);
            Notify({ type: 'warning', message: '不能有兩個相同時間段！已自動刪除' });
            let event = {target:{id:j}};
            this.onClose_timeTag(event);    // 調用刪標籤的function，同原理
          }
        }
      }
      if ( this.data.timePickArray[arrLength].begin && this.data.timePickArray[arrLength].end ) { // 成功添加 提示
        Notify({ type: 'success', message: '成功添加！（ '+(arrLength+1)+' / 4 ）' });
      }
    }
    else {                        // 非投票mode，已刪除剩下3個元素，只對[0]操作
      let model = this.data.timePickModel;
      this.setData({  ['timePickArray[0].'+model] : e.detail  })
    }

    this.setData({  show_timePicker: false });    // 關閉wxml上的timePicker
  },
  // Tag標籤刪除
  onClose_timeTag(event) {
    // 刪除timePickArray數組元素
    let timePickArr = this.data.timePickArray;
    timePickArr.splice(event.target.id,1);
    timePickArr.push({begin:'',end:''});
    this.setData({  timePickArray : timePickArr  })
  },
// 輸入框匯總監聽
  onChange_field(e) {
    let userInputValue = e.detail;
    let userInputType = e.currentTarget.dataset.model;
    if (userInputType=="attendCode_input") {
      // 簽到密碼的字母不區分大小寫
      this.setData({    [userInputType]: userInputValue.toUpperCase()    });
    }
    else if (userInputType=="courseName_input") {
      this.setData({    [userInputType]: userInputValue.toUpperCase()    });
    }
    else {
      // 输入监听，該方法可以多個input綁定同一個函數
      this.setData({    [userInputType]: userInputValue    });
    }
  },
  // update當前js的courseInfo
  updateLocalData(){
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    if (userCloudDataStorage) {
      console.log("存在userCloudDataStorage緩存");
    }
    else {
      console.log("不存在userCloudDataStorage緩存");
    }
    console.log(userCloudDataStorage.data);
    // 寫入當前js的courseInfoInput數據，缺helper、講師等數據寫入 - 未完成
    this.setData({
      ['courseInfoInput['+this.data.courseInfoInput_courseNameIndex+'].input']    : this.data.courseName_input,
      ['courseInfoInput['+this.data.courseInfoInput_courseContentIndex+'].input'] : this.data.courseContent_input,
      ['courseInfoInput['+this.data.courseInfoInput_courseAdresIndex+'].input']   : this.data.courseAdres_input,
      ['courseInfoInput['+this.data.courseInfoInput_attendCodeIndex+'].input']    : this.data.attendCode_input,
      ['courseInfoInput['+this.data.courseInfoInput_speakerNameIndex+'].input']   : userCloudDataStorage.data.userInfoInput[1].input, // 寫入講者姓名
      ['courseInfoInput['+this.data.courseInfoInput_speakeridIndex+'].input']     : userCloudDataStorage.data.userInfoInput[8].input,   // 寫入講者arkid
      ['courseInfoInput['+this.data.courseInfoInput_helperIndex+'].input[0]']     : this.data.helperInfoArray[0],  // 寫入helper 1的信息
      ['courseInfoInput['+this.data.courseInfoInput_helperIndex+'].input[1]']     : this.data.helperInfoArray[1],  // 寫入helper 2的信息
    })
    if (!this.data.allowVote) {    // 講者設定時間mode，直接將具體時間寫入courseInfoInput數組內
      this.setData({
        ['courseInfoInput['+this.data.courseInfoInput_courseTimeIndex+'].input[0]'] : this.data.datePick,
        ['courseInfoInput['+this.data.courseInfoInput_courseTimeIndex+'].input[1]'] : this.data.timePickArray[0].begin,
        ['courseInfoInput['+this.data.courseInfoInput_courseTimeIndex+'].input[2]'] : this.data.timePickArray[0].end,
        // input[1]為timeBegin
        // input[2]為timeEnd
      })
    }
  },
  // 輸入校驗
  inputCheck () {
    let haveSetArr = [];
    // this.setData({  haveSetArr  })
    haveSetArr.push({name:'courseName',   state:!!this.data.courseName_input});
    haveSetArr.push({name:'courseContent',state:!!this.data.courseContent_input});
    haveSetArr.push({name:'courseAdres',  state:!!this.data.courseAdres_input});
    haveSetArr.push({name:'date',         state:!!this.data.datePick});
    haveSetArr.push({name:'time',         state:!!this.data.timePickArray[0].end});
    
    for (let i = 0; i < this.data.timePickArray.length; i++) {
      if (this.data.timePickArray[i].begin && !this.data.timePickArray[i].end) {
        console.log("刪除",this.data.timePickArray[i]);
        let event = {target:{id:i}};
        this.onClose_timeTag(event);    // 調用刪標籤的function，同原理
        break
      }
    }
    if ( !!this.data.attendCode_input && this.data.attendCode_input.length < 4) {
      console.log("attendCode輸入太少");
    } else if (!!this.data.attendCode_input) {
      // console.log("設定了attendCode",true);
      haveSetArr.push({name:'attendCode',state:true});
    } else if (!this.data.attendCode_input) {
      this.data.courseInfoInput[this.data.courseInfoInput_attendCodeIndex].input = "None"
    }
    if (this.data.helperInfoArray.length!=0) {
      // console.log("設定了helper",true);
      haveSetArr.push({name:'helper',state:true});
    }
    console.log(haveSetArr);
    this.setData({  haveSetArr  })
  },

// 提交 / 退出 按鈕綁定事件
  onClick_saveSubmit (e) {
    let userClickType = e.currentTarget.dataset.model;
    this.setData({    [userClickType]: true    });

    // 寫入當前js的courseInfoInput數據，缺helper、講師等數據寫入 - 未完成
    this.updateLocalData();

    if (this.data.btn_quit) {   // 點擊了保存並退出按鈕
      if (!this.data.courseName_input) { // 如果輸入為空
        wx.navigateBack({    delta: 0,   })   // 回退上一頁
      } 
      else {
        Dialog.confirm({
          title: '重要提示',
          message: '確定要退出嗎？\n當前輸入不會被保存！',
        })
        .then(() => {
          // on confirm
          wx.navigateBack({    delta: 0,   })   // 回退上一頁
        })
        .catch(() => {
          // on cancel
        });
      }
    }
    if (this.data.btn_submit) { // 點擊了保存並上傳按鈕
      console.log("用戶請求submit");
      let ok = false;
// 如數據無誤，提交到雲端，管理員端提示 - 未完成
      // 輸入校驗
      this.inputCheck();
      for (let i = 0; i < this.data.haveSetArr.length; i++) {
        if (!this.data.haveSetArr[i].state) {
          console.log(this.data.haveSetArr[i].name,"有問題");
          Notify({ type: 'danger', message: this.data.haveSetArr[i].name+' 未填入！' });
          ok = false;
          break
        } else {
          ok = true;
        }
      }
      if ( ok ) {
        console.log("當前courseInfoInput：",this.data.courseInfoInput);
        const userInfoStorage = wx.getStorageSync('userInfo');  // 用戶緩存
        Dialog.confirm({
          title: '重要提示',
          message: '確認提交審核嗎？',
        })
        .then(res=>{    // 點擊確認！
          // 上傳數據 本地 → 雲端 - 未完成
          wx.cloud.callFunction({   // 調用加課的雲函數 courseAdd
            name : 'courseAdd',
            data : {
              avatarUrl       : userInfoStorage.data.avatarUrl,
              nickName        : userInfoStorage.data.nickName,
              courseInfoInput : this.data.courseInfoInput ,
              allowVote       : this.data.allowVote,
              datePickArray   : this.data.datePickArray,
              timePickArray   : this.data.timePickArray,
            }
          }) .then (res=>{
            console.log(res);
          }) .catch (err=>{
            console.error(err);
          })
  
          // 跳轉課程詳情頁
          wx.redirectTo({
            url: '../courseDetail/courseDetail',
          })
        }) .catch(err=>{  console.error(err);  })
      } // if輸入校驗 - end
    } // if點擊了submit button - end
  },

  // 選填區
  // 選擇helper - 確認按鈕
  confirmHelper() {
    // 1 數據庫查詢 arkid 是否存在
      // 存在，返回頭像，寫入本地js的helper數據
      // 不存在，提示不存在
    const searchArkid = () => {    // 新增promise，準備鏈式調用
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

    if (this.data.helperInfoArray.length<2 && !!this.data.helperid_input) {   // Helper數未滿
      if (this.data.helperid_input == userCloudDataStorage.data.arkid ) {                                         // 如果搜索的是自己，提示不可以
        Notify({ type: 'warning', message: 'Helper 不能是自己！' });
      } else if ( this.data.helperInfoArray[0] && this.data.helperInfoArray[0].arkid==this.data.helperid_input) { //第二位同一人
        Notify({ type: 'warning', message: '第二位 Helper 不能是同一個人！' });
      } else {                                                                                                    // 搜索的是別人，允許
        Dialog.confirm({
          title: '重要提示',
          message: '確認添加 arkid：'+this.data.helperid_input+' 的用戶作為helper嗎？\n一經確認，不能修改！',
        })
        .then(() => {
          // on confirm
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
              Notify({ type: 'success', message: 'Helper 添加成功！（  '+this.data.helperInfoArray.length+' / 2 ）' });
            } else {  // 用戶不存在
              Notify({ type: 'warning', message: '該用戶不存在，請協商或反饋！' });
            }
          }) .catch(err=>{  console.error(err);  })
        })
        .catch(() => {
          // on cancel
        })
      }
    } else if (this.data.helperInfoArray.length==2){                                    // Helper數已滿（2人）
      Notify({ type: 'warning', message: 'Helper 數已滿！不能再添加' });
    }

  },
});