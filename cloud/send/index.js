// 該雲函數用於定時檢查，有無需要推送的課程。

const cloud = require('wx-server-sdk');
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let nowTimeStamp = Date.now();
  // 查詢courseState為'opening'的課，且 0< 開始時間-nowTimeStamp <=30.5min
  db.collection('course') .where({
    courseState     : 'opening',
    followMember    : _.exists(true),
    // 0< 開始時間-nowTimeStamp <=30.5min
    timeStampPick   : _.gt(nowTimeStamp).and(_.lte(30.5*60*1000+nowTimeStamp)),
  }) .field({
    _id             : true,
    courseInfoInput : true,
    followMember    : true,
    timePickArray   : true,
    timeStampPick   : true,
  }) .get()
  .then(res=>{
    let result = res.data;
    if (result.length != 0) {   // 未來半小時內有課程要開始，觸發訂閱雲函數
        result.map((item)=>{
          let courseInfo      = item.courseInfoInput;
          let courseId        = item._id;
          let beginTime       = item.timePickArray[0].begin;
          let followMember    = item.followMember;
          console.log("課程id ",courseId," ，將在 ",beginTime," 開始，有",followMember.length,"個用戶需要推送訂閱消息");
          let followMemberIdArr = followMember.map((e)=>{
              return e.arkid;
          })
          console.log("將要發送推送的純arkid數組",followMemberIdArr);
          // 整理為對象數據，準備傳入雲函數
          let startTime = courseInfo[5].input[0]+' '+courseInfo[5].input[1]+'~'+courseInfo[5].input[2];
          console.log(startTime);
          let SendData = {
            "thing12": {             // 主辦方
                "value": courseInfo[6].input
            },
            "thing2": {             // 活動名稱
                "value": courseInfo[1].input
            },
            "date3": {              // 活動日期
              "value": startTime
              // "value": courseInfo[5].input[0]
              // "value": '2021-09-04'
            },
            "thing10": {             // 活動地點
                "value": courseInfo[4].input
            },
            "thing11": {            // 備註
                "value": '半個小時內即將開課！'
            },
          };

          // 查詢對應user的OPENID
          db.collection('user') .where({
            arkid : _.in(followMemberIdArr),
          }) .field({ _id : true }) .get() 
          .then( resUserInfo => {
            // 查詢數據庫儲存的模板ID
            db.collection('config') .doc('tmplIds') .field({tmplIds:true}) .get() 
            .then( resTmpl => {
              console.log("雲端模板ID",resTmpl.data.tmplIds)
              let templateId_courseRemind = resTmpl.data.tmplIds[0].templateId
              // 循環遍歷OPENID數組，發送訂閱
              let openIdArr = resUserInfo.data.map((userInfo)=>{
                // 調用發送訂閱雲函數
                cloud.callFunction({
                    name:'subscribeMessageSend',
                    data : {
                        data        : SendData,
                        templateId  : templateId_courseRemind,
                        OPENID      : userInfo._id,
                        courseId    : courseId,
                    }
                }) .then(res=>{
                    console.log("雲函數調用成功：",res.result);
                }) .catch(err=>{
                    console.error("雲函數調用失敗：",err);
                })
                return userInfo._id;
              })
              console.log("將要發送推送的純OPENID數組",openIdArr);
            })
          })
        })
        console.log("所有符合推送訂閱條件的課程",result);
    } else{                     // 未來半小時沒有課程要開始
      console.log("沒有符合條件的課程數據，不需要提醒訂閱。");
    }
  })
  .catch(err=>{
      console.error(err);
  })

}