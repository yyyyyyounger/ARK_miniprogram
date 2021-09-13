let app = getApp();

import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';
import pjXML from '../../../../plugin/pjxml';   // JQ庫

Page({
  data: {
    datetime: "yyyy-mm-ddThh:mm:ss+08:00",
    vehiclePlateNumber: "",
    station: ""
  },
  onLoad: function() {
    this.checkBus();
    
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
     // 查詢該用戶的管理員權限
     if (userCloudDataStorage && userCloudDataStorage.data.admin) {
      this.setData({  admin : userCloudDataStorage.data.admin  })
     }
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
        // 獲取返回的html數據
        let result = res.data._tapestry.content[0][1];
        // console.log(result);   //  純html純文本

        // 解析返回的html
        var doc = pjXML.parse(result);

        // 解析所有站點名稱
        // 車到站時有13元素，未到站有12元素
        let allSite = doc.selectAll('//span');
        let busArrive = false;
        let arriveStop;
        allSite = allSite.map((e,index)=>{
          if (e.content.length>1) {
            busArrive = true;
            arriveStop = allSite[index+1].content[0];
            console.log("巴士到了：",arriveStop);
          }
          return e.content[0];
        })
        console.log("Bus到站狀態",busArrive);
        that.setData({  busArrive  })

        // 解析所有div元素
        let allDiv = doc.selectAll('//div');
        
        let busName;
        let busStop=[];
        // console.log("到站時的數據",allSite);
        if (busArrive) {
          // 獲取車牌名 和 站點名
          allSite.map((e,index)=>{
            if (e.substring(0,4).indexOf(" ") == -1) {
              // console.log("没有空格，index為",index);
            } else {
              // console.log("有空格，index為",index,'該為站點');
              busStop.push(e)
            }
            if(escape(e).indexOf("%u")<0){
              // console.log("没有包含中文，這是bus，數組索引為",index);
              busName = e;
              busStop.push(busName)
            } else{
              // console.log("包含中文");
            }
          })
        }

        // 如果巴士未到站，算法查詢到哪
        let busArriveWhere = [];
        if (!busArrive) {
          allDiv = allDiv.map((e)=>{
            let isBus = e.attributes.class=="left out-left";
            if (e.attributes.class=="right" || isBus) {
              if (isBus && e.content[0].length>17) {
                busName = e.content[0].replace(/\s+/g, '');
                // console.log("這是Bus",busName);
                busArriveWhere.push(busName)
              } else if (!isBus) {
                busArriveWhere.push(e.content[1].content[0])
                // console.log(e.content[1].content[0]); // 站點名
              }
            }
          })
          // console.log("未到站的Bus數據",busArriveWhere);
          busStop = busArriveWhere;
          // 獲取站點名
          if (false) {
            
            busArriveWhere.map((e)=>{
              if (e.substring(0,4).indexOf(" ") == -1) {
                // console.log("没有空格");
              } else {
                // console.log("有空格",'該為站點');
                busStop.push(e)
              }
            })
          }
        }

        console.log('巴士名為',busName);
        console.log('巴士站為',busStop);
        that.setData({
          busName,
          busStop,
        })


        // 放入data，給wxml渲染
        that.setData({  result  })
        Toast.success('加載成功！')

        // 5s返回一次
        setTimeout(() => {
          // that.checkBus();
        }, 10000);
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