var app = getApp();
const db = wx.cloud.database();   // 數據庫

Page({
  data: {
    // 骨架屏
    loading:true,
    // 步驟條 - begin
    numList: [{
      name: '填寫信息'
      }, {
        name: '提交管理員審核'
      }, {
        name: '課程發佈'
      }, 
    ],
    stepsActive:1,    // 控制步驟條active
    // 步驟條 - end
  },
  onLoad: function(options){
    this.app = getApp();
    // 獲取上個頁面傳遞的參數，說明用戶組和需要渲染的courseId
    let detailInfo = JSON.parse(options.detailInfo);
    this.setData({  detailInfo  })
    console.log("上個頁面傳遞值為：",this.data.detailInfo)

    // 請求雲端的courseInfo數據，該courseId為num類型
    this.returnCourseData();
    
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    // 從緩存中獲取該用戶是否管理員
    this.setData({  
      admin         : userCloudDataStorage.data.admin,
      userCloudData : userCloudDataStorage.data,
    })
  },
  onReady() {
    console.log("課程詳情頁 - 已经Ready");
  },
  // 請求數據庫返回該courseId的數據
  returnCourseData (){
    // 請求雲端的courseInfo數據，該courseId為num類型
    db.collection('course') .doc(this.data.detailInfo.courseId) .get()
    .then(res=>{
      console.log("該courseId在數據庫儲存的數據為：",res.data);
      this.setData({  courseCloudData : res.data  })
      this.setData({  courseInfoInput : this.data.courseCloudData.courseInfoInput  })
      this.ArrayDataInit(this);   // 數據操作數組、對象等的初始化

      this.setData({  loading: false,  }) // 骨架屏消失
    }) .catch(err=>{  console.error(err);  })
  },
  // 匹配shortName對象，單個渲染/設定時適用對象，for循環時適用數組
  findSetData(shortNameArray) {
    // 匹配出shortName的index，生成為一個對象形式
    let shortNameIndex={};
    this.data.courseInfoInput.map(function (e, item) {    // 究極優化！本質上一行代碼匹配出所有index
      shortNameIndex[e.shortName] = e.id;
    });
    this.setData({  shortNameIndex  })
    // console.log("shortNameIndex為",shortNameIndex);

    // 匹配出shortName的display權限，生成為一個對象形式
    let shortNameDisplay={};
    this.data.courseInfoInput.map(function (e, item) {
      shortNameDisplay[e.shortName] = e.display;
    });
    this.setData({  shortNameDisplay  })
    // console.log("shortNameDisplay為",shortNameDisplay);
  },
  // 初始化各種數組
  ArrayDataInit(that) {
    // 生成 無input版 courseInfo的shortName數組
    let shortNameArray = that.data.courseInfoInput.map((item)=>{    return item.shortName   });
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = that.data.courseInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = that.data.courseInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    that.setData({    InfoDisplay, canEdit, shortNameArray    });
    // 初始化所有index值
    that.findSetData(shortNameArray);
  },

  onPullDownRefresh: function(){
    this.returnCourseData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onShareAppMessage: function(){

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
      num: this.data.num == this.data.numList.length - 1 ? 1 : this.data.num + 1
    })
  },

  // 跳轉編輯頁
  editInfo() {
    let detailInfo = {
      user             :   "speaker",
      courseCloudData  :   this.data.courseCloudData,
    }
    detailInfo = JSON.stringify(detailInfo);
    wx.navigateTo({
      url: '../holdACourses/holdACourses?detailInfo=' + detailInfo,
    })
  },


});