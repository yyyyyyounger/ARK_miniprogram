// 時間函數.js
const utils = require('../../utils/util.js')

Page({
  onLoad () {
    this.app = getApp();
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.direct()
    }, 3000)
  },
  onShow () {
    this.app.sliderAnimaMode(this, 'slide_up1', -350, 1, 0, 0);
    this.app.sliderAnimaMode(this, 'slide_up2', -350, 1, 0, 300);
    this.app.sliderAnimaMode(this, 'slide_up3', -350, 1, 0, 600);
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.onHide()
    }, 1800)
  },
  onHide () {
    this.app.sliderAnimaMode(this, 'slide_up1', 350, 0, 0, 0);
    this.app.sliderAnimaMode(this, 'slide_up2', 350, 0, 0, 300);
    this.app.sliderAnimaMode(this, 'slide_up3', 350, 0, 0, 600);
    console.log("onHide() - launch");
  },
  direct () {
    let url = '/pages/index/index'
    wx.switchTab({
      url,
    })
  },
})
