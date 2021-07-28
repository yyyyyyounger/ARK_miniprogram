var app = getApp();
const db = wx.cloud.database();   // 數據庫

Page({
  data: {
    // 步驟條 - begin
    numList: [{
      name: '填寫信息'
      }, {
        name: '提交管理員審核'
      }, {
        name: '課程發佈'
      }, 
    ],
    basics: 0,
    num: 1,
    scroll: 0,
    // 步驟條 - end
  },
  onLoad: function(options){
    // 請求雲端的courseInfo數據
    // db.collection('course') .orderBy("_id","desc") .field({ _id:true }) .limit(1) .get()
    // .then(res=>{
    //   console.log(res.data[0]._id);
    //   wx.cloud.callFunction({
    //     name:'courseInfoSearch',
    //     data:{
    //       courseId : res.data[0]._id
    //     }
    //   })
    //   .then(res=>{
    //     console.log("最新的課程信息為：",res.result.courseCloudData.data[0]);
    //   })
    // }) .catch(err=>{
    //   console.error(err);
    // })
    db.collection('course') .where({
      _id:'3'
    }) .get()
    .then(res=>{
      console.log(res.data[0]);
    })
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

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

});