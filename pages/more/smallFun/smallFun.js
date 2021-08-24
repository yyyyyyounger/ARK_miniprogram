Page({
  data: {
    datetime: "yyyy-mm-ddThh:mm:ss+08:00",
    vehiclePlateNumber: "",
    station: ""
  },
  onLoad: function() {
    
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  onTabItemTap:function(item) {

  },
  
  btnClick:function(){
    var that = this;
    var start_time = formatTime_start_bus_api(new Date());
    var end_time = formatTime_end_bus_api(new Date());
    console.log('start time', start_time);
    console.log('end time', end_time);
    wx.request({
      url: `https://api.data.um.edu.mo/service/facilities/shuttle_bus_arrival_time/v1.0.0/all?date_from=${start_time}&date_to=${end_time}`,
      data: {},
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer 44f6acc1-df55-30d8-a30e-ac84403b05b5'
      },
      success(res){
        console.log(res.data);
        if(res.data._returned == 0){
          console.log("returned 0");
          that.setData({
            datetime: "",
            station: "還沒發車",
            vehiclePlateNumber: ""
          })
        }else{
          that.setData({
            datetime: res.data._embedded[0].datetime,
            station: res.data._embedded[0].station,
            vehiclePlateNumber: res.data._embedded[0].vehiclePlateNumber
          })
        }
      },
      fail(res){
        console.log(res);
      }
    })
  } 
});

const formatTime_start_bus_api = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes() - 2
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')}T${[hour, minute, second].map(formatNumber).join('%3A')}%2B08%3A00`
}

const formatTime_end_bus_api = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() 
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (minute < 0) {
    hour -= 1;
    minute += 60;
  }

  return `${[year, month, day].map(formatNumber).join('-')}T${[hour, minute, second].map(formatNumber).join('%3A')}%2B08%3A00`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}