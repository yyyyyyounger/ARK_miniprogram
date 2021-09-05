var cloudData = require('../../../../data/cloud')

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  onLoad:function(e){//不知道是不是我乱改了些代码的原因，下面这一段放在onShow中则无法运行=-=
    let pageNum = JSON.parse(e.pageNum)
    this.setData({
      page:pageNum
    })
    let institutionNum = JSON.parse(JSON.stringify(cloudData.institutionNum));
    let institutionInfo = JSON.parse(JSON.stringify(cloudData.institutionInfo));
    this.setData({  
      institutionNum       : institutionNum,
      institutionInfo : institutionInfo,
    });
    console.log(institutionNum)
  },

  onShow: function (e) {
    this.setData({
      institutionNum:this.data.institutionNum-1,
    })
    
  },

  pageUp(){
    this.setData({
      page:this.data.page+1
    })
  },

  pageDown(){
    this.setData({
      page:this.data.page-1,
    })
  }
})

