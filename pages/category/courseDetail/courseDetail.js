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
  onShow() {
    this.onPullDownRefresh();
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

  fileTest(e){
    wx.chooseMessageFile({
      count: 3,   // 限制選擇文件個數
      // type: 'image',
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles   // 數組形式
        console.log(tempFilePaths);
      }
    })
  },

  uploadfile:function(e) {
    wx.chooseMessageFile({
      count : 3,      // 可选择最大文件数 （最多100）
      type  : 'all',  // 文件类型，all是全部文件类型
      success(res) {
        console.log(res.tempFiles)
        const filePath = res.tempFiles[0].path            // 文件本地临时路径
        console.log(filePath);
        // 上传文件
        const cloudPath = res.tempFiles[0].name // '上传文件文件夹/' + filename 云存储路径
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: resa => {
            console.log(resa);
            console.log(resa.fileID)
            const db = wx.cloud.database()
            //把文件名和文件在云存储的fileID存入filelist数据表中
            // db.collection('filelist').add({
            //   data: {
            //     filename    : filename,
            //     fileid      : resa.fileID,
            //     updateTime  : Date.now(),
            //   },
            // })
          },
          fail: e => {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
        })

        // uploadTask.onProgressUpdate((res) => {
        //   console.log('上传进度', res.progress)
        //   console.log('已经上传的数据长度', res.totalBytesSent)
        //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        // })
      }
    })
  },

  /**
  * 上傳多個文件，限制5個
  */
  uploadFileTest:function(){
    var that = this;
    wx.chooseMessageFile({    // 選擇圖片
      count: 5,
      type  : 'all',          // 文件类型，all是全部文件类型
      success: function(res){
        let filePaths = res.tempFiles;  // 已選擇文件的信息，對象數組，有name、path臨時路徑等屬性
        console.log(filePaths);
        var successUp = 0;              //成功
        var failUp = 0;                 //失败
        var length = res.tempFiles.length; //总数
        var count = 0;                  //第几张
        // 判斷總大小是否超過50M限制
        let allSize = 0;
        for (let i = 0; i < length; i++) {
          allSize += filePaths[i].size;
        }
        console.log("總大小為 ",allSize/1000000," MB");
        if (allSize/1000000 < 50) { // 小於50MB即可上傳
          that.uploadOneByOne(filePaths,successUp,failUp,count,length);
        }
      },
    })
  },


  /**
  * 上傳9張限制的照片 - 未使用
  */
  uploadImg:function(){
    var that = this;
    wx.chooseImage({    // 選擇圖片
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
          var successUp = 0; //成功
          var failUp = 0; //失败
          var length = res.tempFilePaths.length; //总数
          var count = 0; //第几张
        that.uploadOneByOne(res.tempFilePaths,successUp,failUp,count,length);
      },
    })
  },
  /**
   * 采用递归的方式上传多张
   */
  uploadOneByOne(filePaths, successUp, failUp, count, length){
    var that = this;
    wx.showLoading({  // 上傳提示
      title: '正在上傳第 '+count+' 個文件',
    })
    wx.cloud.uploadFile({
      cloudPath : filePaths[count].name,    // 雲儲存路徑 '雲端目標文件夾/' + 定義的fileName
      filePath  : filePaths[count].path,    // 本地臨時路徑
      success:function(e){    // 執行成功回調
        successUp++;//成功+1
        console.log(e.fileID);  // 該id為雲端儲存id，用於下載
        // 1 寫入fileList集合，附帶該課程的courseId、createAt、文件夾路徑。 - 未完成
      },
      fail:function(e){       // 執行失敗回調
        failUp++;//失败+1
      },
      complete:function(e){   // 執行完成回調
        count++;//下一张
        if(count == length){
          //上传完毕，作一下提示
          console.log('上傳成功 ' + successUp + '個，' + '失敗 ' + failUp + ' 個');
          wx.showToast({
            title: '上傳成功 ' + successUp + ' 個',
            icon: 'success',
            duration: 2000
          })
        }else{
          //递归调用，上传下一张
          that.uploadOneByOne(filePaths, successUp, failUp, count, length);
          console.log('正在上傳第 ' + count + ' 個文件');
        }
      }
    })
  },

});