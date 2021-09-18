let app = getApp();

import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast';
import pjXML from '../../../../plugin/pjxml';   // JQ庫
let stationIndex
let nextBus
let serviceStatus

//巴士icon style数据
let busStyle=[{
  id:0,
  style:'right:70rpx; top: 1000rpx',
},
{
  id:1,
  style:'right:70rpx; top: 650rpx',
},
{
  id:2,
  style:'right:70rpx; top: 80rpx',
},
{
  id:3,
  style:'left:220rpx; top: 140rpx',
},
{
  id:4,
  style:'left:60rpx; top: 340rpx',
},
{
  id:5,
  style:'left:60rpx; top: 600rpx',
},
{
  id:6,
  style:'left:60rpx; top: 900rpx',
},
{
  id:7,
  style:'top: 1070rpx;left: 460rpx;',
},
{
  id:8,
  style:'right:70rpx; top: 825rpx',
},
{
  id:9,
  style:'right:70rpx; top: 365rpx',
},
{
  id:10,
  style:'top: 10rpx;left: 400rpx',
},
{
  id:11,
  style:'top: 210rpx;left: 180rpx;',
},
{
  id:12,
  style:'left:60rpx; top: 470rpx',
},
{
  id:13,
  style:'left:60rpx; top: 750rpx',
},
{
  id:14,
  style:'left:60rpx; top: 1000rpx',
},
{
  id:15,
  style:'left:6000rpx',//没车的时候把车移到屏幕外=-=
}
]

// 定時返回定時器
let busTimer;
// 執行次數
let runTimes = 1;

let timeStamp;

Page({
  data: {
    datetime: "yyyy-mm-ddThh:mm:ss+08:00",
    vehiclePlateNumber: "",
    station: "",
    popupShow:false,
    //站点名以及对应图片 用于点击站点后弹出层的渲染
    imageSrc:[
      {
        id:0,
        name:'PGH 研究生宿舍（起）',
        src:'https://campusloop.cmdo.um.edu.mo/photo/PGH.jpg'
      },
      {
        id:1,
        name:'E4 劉少榮樓',
        src:'https://campusloop.cmdo.um.edu.mo/photo/E4.jpg'
      },
      {
        id:2,
        name:'N2 大學會堂',
        src:'https://campusloop.cmdo.um.edu.mo/photo/N2.jpg'
      },
      {
        id:3,
        name:'N6 行政樓',
        src:'https://campusloop.cmdo.um.edu.mo/photo/N6.jpg'
      },
      {
        id:4,
        name:'E11 科技學院',
        src:'https://campusloop.cmdo.um.edu.mo/photo/E11.jpg'
      },
      {
        id:5,
        name:'E21 人文社科樓',
        src:'https://campusloop.cmdo.um.edu.mo/photo/E21.jpg'
      },
      {
        id:6,
        name:'E32 法學院',
        src:'https://campusloop.cmdo.um.edu.mo/photo/E32.jpg'
      },
      {
        id:7,
        name:'S4 研究生宿舍南四座（終）',
        src:'https://campusloop.cmdo.um.edu.mo/photo/S4.jpg'
      },
    ]
  },
  onLoad: function() {
  },
  onShow: function() {
    timeStamp = Date.now();
    Toast.loading({
      message: '等我Load一下',
      forbidClick: true,
    });
    this.checkBusNew();
  },
  onHide: function() {
    // 销毁定时器
    clearInterval(busTimer);
  },
  onUnload: function () {
    // 销毁定时器
    clearInterval(busTimer);
  },

  onPullDownRefresh: function() {
    // 5s內第二次刷新
    if (Date.now()-timeStamp<=10*1000) {
      Toast('10s後再試吧~')
    }
    else {
      Toast.loading({
        message: '等我Load一下',
        forbidClick: true,
      });
      this.checkBusNew();
      wx.stopPullDownRefresh();
      timeStamp = Date.now();
    }
  },
  onShareAppMessage: function() {

  },
  // 查詢巴士站點信息 - 本地請求版，正式版無法獲取數據
  checkBusLocal () {
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
            // 找到站点对应的index，并减3（stationIndex 0~7 为到站对应的CSS数组数据）
            stationIndex = index-4;
            nextBus = allSite[1].content[0];//到站时的查找下一辆车发车时间
            serviceStatus = allSite[2].content[0];//到站时的查找服务状态
            console.log(allSite,'allSite')
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
            if(busName){//当有车在校园中且没到站时（就是有BUSName显示的时候)
              nextBus = allDiv[2].content[1].content[0];//下一班时间
              serviceStatus = allDiv[3].content[1].content[0];//服务状态
            }
            else{//校园中没车的时候
              nextBus = '下一班：No info';//下一班时间
              serviceStatus = allDiv[2].content[1].content[0];//服务状态
            }
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
          // 找到下一站对应的index，并加7（stationIndex 8~14 将CSS更改为未到站对应的数组数据）
          if(busName){
            var stationIndex = busArriveWhere.indexOf(busName)+7
          }
          else{//没车的时候 stationIndex 15 为无车的CSS，隐藏车车
            var stationIndex = 15
          }
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
        console.log("stationIndex",stationIndex);
        console.log('巴士名為',busName);
        console.log('巴士站為',busStop);
        var busNowStyle = busStyle[stationIndex].style;
        that.setData({
          busName,
          busStop,
          busNowStyle,
          nextBus,
          serviceStatus,
          stationIndex,
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
  // 雲函數版
  checkBusNew () {
    let that = this;
    wx.cloud.callFunction({
      name:'httpPost',
      data: {
          uri:'https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo.zone:refreshzone',
          headers: {
              'Host': "campusloop.cmdo.um.edu.mo",
              'X-Requested-With': "XMLHttpRequest",
              'Origin': "https://campusloop.cmdo.um.edu.mo",
              'Referer': "https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo",
          },
      }
    })
    .then(rqRes=>{
      // console.log(rqRes)
      const data = JSON.parse(rqRes.result)
      // console.log(data)
      let result = data._tapestry.content[0][1];
      //  純html純文本
      // console.log(result);

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
          // 找到站点对应的index，并减3（stationIndex 0~7 为到站对应的CSS数组数据）
          stationIndex = index-4;
          nextBus = allSite[1].content[0];//车到站时的查找下一班车时间
          serviceStatus = allSite[2].content[0];//车到站时的查找服务状态
          // console.log(nextBus)
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
          if(busName){//当有车在校园中且没到站时（就是有busName显示的时候)
            nextBus = allDiv[2].content[1].content[0];//下一班时间
            serviceStatus = allDiv[3].content[1].content[0];//服务状态
          }
          else{//校园中没车的时候
            nextBus = '下一班：No info';//下一班时间
            serviceStatus = allDiv[2].content[1].content[0];//服务状态
          }
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
        // 找到下一站对应的index，并加7（stationIndex 8~14 将CSS更改为未到站对应的数组数据）
        if(busName){
          var stationIndex = busArriveWhere.indexOf(busName)+7
        }
        else{//没车的时候 stationIndex 15 将CSS更改为把车移除
          var stationIndex = 15
        }

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
      // console.log("stationIndex",stationIndex);
      // console.log('巴士名為',busName);
      // console.log('巴士站為',busStop);
      var busNowStyle = busStyle[stationIndex].style;
      let noBusStr = 'No bus';
      if (!busName) {
        busName = noBusStr
      }
      that.setData({
        busName,
        busStop,
        busNowStyle,
        nextBus,
        serviceStatus,
        stationIndex,
      })

      Toast.success('加載成功')

      // 10s返回一次
      if (busName!=noBusStr) {
        busTimer =  setTimeout(() => {
          // 連續運行0.5分鐘
          if (runTimes++ <= 2) {
            this.checkBusNew();
          } 
          // 已超過1分鐘
          else {
            runTimes = 1;
            clearInterval(runTimes)
            Toast('休息一下吧。。')
          }
        }, 10000);
      } else {
        Toast('現在已經沒有Bus了...')
      }
    })

  },

  onClose() {
    this.setData({ popupShow: false });
  },
  tapped(e){
    this.setData({
      popupSrc:this.data.imageSrc[e.currentTarget.id].src,
      popupName:this.data.imageSrc[e.currentTarget.id].name
    })
    this.setData({ popupShow: true });
  }
});