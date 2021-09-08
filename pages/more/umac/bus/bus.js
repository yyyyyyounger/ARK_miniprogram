import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    datetime: "yyyy-mm-ddThh:mm:ss+08:00",
    vehiclePlateNumber: "",
    station: ""
  },
  onLoad: function() {
    this.checkBus();
  },
  onShow: function() {
  },
  onPullDownRefresh: function() {
    this.checkBus();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {

  },
  // 查詢巴士站點信息
  checkBus () {
    let that = this;
    wx.request({
      url: 'https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo.zone:refreshzone',
      method : 'POST',
      header : {
        'Host': "campusloop.cmdo.um.edu.mo",
        'X-Requested-With': "XMLHttpRequest",
        'Origin': "https://campusloop.cmdo.um.edu.mo",
        'Referer': "https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo",
        // 'Cookie': "_ga=GA1.3.1723930737.1590572330",
      },
      success (res) {
        let result = res.data._tapestry.content[0][1];
        // result = result.replace(/div/g, 'view');
        // result = result.replace(/<a/g, '<view');
        // result = result.replace(/a>/g, 'view>');
        // result = result.replace(/span/g, 'text');
        // result = result.replace(/img/g, 'image');

        console.log(result);
        that.setData({  result  })
        // 5s返回一次
        // setTimeout(() => {
        //   that.checkBus();
        // }, 5000);
        Toast.success('加載成功！')
      }, 
      fail (err) {
          console.error(err);
          this.setData({
            result : undefined
          })
      }
    })
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

// api請求法 - 棄用狀態
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