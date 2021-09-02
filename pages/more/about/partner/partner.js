Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow: function () {
    this.setData({
      page:1
    })
    console.log(this.data.page)
  },

  pageUp(){
    this.setData({
      page:this.data.page+1
    })
    console.log(this.data.page)
  },

  pageDown(){
    this.setData({
      page:this.data.page-1
    })
    console.log(this.data.page)
  }
})