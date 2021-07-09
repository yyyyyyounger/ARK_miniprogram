var app = getApp();
var cloudData = require('../../../data/cloud.js')

Page({
  data: {
    basicsList: [{
      icon: 'usefullfill',
      name: '开始'
    }, {
      icon: 'radioboxfill',
      name: '等待'
    }, {
      icon: 'roundclosefill',
      name: '错误'
    }, {
      icon: 'roundcheckfill',
      name: '完成'
    }, ],
    basics: 0,
    numList: [{
      name: '开始'
    }, {
      name: '等待'
    }, {
      name: '错误'
    }, {
      name: '完成'
    }, ],
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
    // 生成 只有"允許顯示"的課程名稱的數組  &  該數組長度下的用戶激活(填寫)課程信息狀態
    let courseNameArray = [];
    let activeArray = [];
    for (let i = 0; i < InfoDisplay.length; i++) { // 抽取數組元素 插入對象數組
      if (InfoDisplay[i]) {
        courseNameArray.push(this.data.courseInfoInput[i].name);
        activeArray.push(false);
      }
    }
    // 允許編輯/顯示 → setData
    this.setData({    InfoDisplay, canEdit, courseNameArray, activeArray,   });
    
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
      [varActive] : true
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

});