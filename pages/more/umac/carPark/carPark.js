Page({
  data: {

  },
  onLoad: function (options) {
    wx.request({
      url: 'https://api.data.um.edu.mo/service/facilities/car_park_availability/v1.0.0/all',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer c444e1b5-2882-3e1f-8e0e-06bef5159434`
      },
      success (res) {
        console.log(res.data._embedded)
      },
      fail (err) {
        console.error(err);
      },
    })
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})