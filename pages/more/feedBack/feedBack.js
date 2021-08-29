// pages/more/feedBack/feedBack.js
Page({
  data: {
    image : [
      {
        id  : 0,
        url : 'https://i.loli.net/2021/08/29/v6OUTRZcNswaYti.jpg',
      },
      {
        id  : 0,
        url : 'https://i.loli.net/2021/08/29/A7PdMymWHp5fb1e.jpg',
      },
    ]
  },

  onLoad: function (options) {

  },
  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  },

  // 圖片預覽
  clickImg: function(e){
    let selectId = e.currentTarget.dataset.id;
    let imgUrl = this.data.image[selectId].url;
    let imgUrlArr = this.data.image.map((e)=>{
      return e.url
    })
    wx.previewImage({
      urls: imgUrlArr, // [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: imgUrl, // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})