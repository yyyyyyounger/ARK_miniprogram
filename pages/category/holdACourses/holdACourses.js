var app = getApp();
var cloudData = require('../../../data/cloud.js')

Page({
  data: {
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
    // 複製雲端數組
    let arrayEmpty = JSON.parse(JSON.stringify(cloudData.courseInfo_empty));
    this.setData({  courseInfoInput : arrayEmpty  });

    // 生成簡易版(無input版)userInfo的shortName數組
    let shortNameArray =    this.data.courseInfoInput.map((item)=>{    return item.shortName   });
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
      courseInfoInput_followersIndex      : shortNameArray.findIndex(o=> o== "followers"),
      courseInfoInput_courseStateIndex    : shortNameArray.findIndex(o=> o== "courseState"),
      courseInfoInput_courseStarsIndex    : shortNameArray.findIndex(o=> o== "courseStars"),
      courseInfoInput_attendCodeIndex     : shortNameArray.findIndex(o=> o== "attendCode"),
    })
    // 生成 userInfoInput裡允許顯示的設置數組
    let InfoDisplay = this.data.courseInfoInput.map(item=>{    return item.display   });
    // 生成 userInfoInput裡允許編輯的設置數組
    let canEdit     = this.data.courseInfoInput.map(item=>{    return item.canEdit    });
    // 生成 只有“必填”項目的名稱的數組 - 待刪除
    let mustEditArray = [];
    mustEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'courseName').name ) ,
    mustEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'courseContent').name ) ,
    mustEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'courseTag').name ) ,
    mustEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'courseAdres').name ) ,
    mustEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'courseTime').name ) ;
    // 生成 只有“選填”項目的名稱的數組
    let chooseEditArray = [];
    chooseEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'helperid').name ) ,
    chooseEditArray.push( this.data.courseInfoInput.find(o => o.shortName === 'attendCode').name ) ,
    // 允許編輯/顯示 → setData
    this.setData({    InfoDisplay, canEdit, mustEditArray, chooseEditArray,   });
    
  },
  onReady: function(){
    
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  },
  BindAddInfo(e) {
    let currentTap = e.currentTarget.dataset.index;
    console.log(currentTap);
    // 觸發課程信息塊顏色改變
    let varActive = 'activeArray['+currentTap+']';
    this.setData({
      [varActive] : true,
      activeArrayIndex : currentTap
    })
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
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    console.log(event);
    this.setData({
      show_calendar: false,
      date: this.formatDate(event.detail),
    });
    console.log(this.data.date);
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
  onChange_field(e) {
    let attendCode = e.detail;
    let userInput = e.currentTarget.dataset.model;
    // console.log("field輸入為：", attendCode );
    // console.log("model為：", userInput );
    // 输入监听，該方法可以多個input綁定同一個函數
    this.setData({
      [userInput]: attendCode
    });
  },
// 簽到密碼
  onChange_attendCode(e) {
    let attendCode = e.detail;
    console.log("簽到密碼輸入為：", attendCode );
  },
});