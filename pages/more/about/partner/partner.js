var cloudData = require('../../../../data/cloud')

Page({
  data: {
  },
  onLoad:function(e) {
    let pageNum = JSON.parse(e.pageNum)
    this.setData({  page : pageNum  })
    let institutionInfo = JSON.parse(JSON.stringify(cloudData.institutionInfo));
    let institutionNum = institutionInfo.length;
    this.setData({
      institutionNum,
      institutionInfo,
    });
  },

  onShow: function (e) {
    this.setData({
      institutionNum : this.data.institutionNum-1,
    })
    
  },

  pageUp(){
    this.setData({
      page : this.data.page+1
    })
  },

  pageDown(){
    this.setData({
      page : this.data.page-1,
    })
  }
})

