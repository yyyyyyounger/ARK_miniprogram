const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let courseId = 1;
  let courseInfo = [
      { id:0, name:"分享编號", shortName:"courseId",       input:"None",                    canEdit:false,     display:false },  // 雲端給該課程分配的編號
      { id:1, name:"分享主題", shortName:"courseName",     input:"None",                    canEdit:true,      display:true },   // 講者設定的主體
      { id:2, name:"分享內容", shortName:"courseContent",  input:"None",                    canEdit:true,      display:true },   // 建設設定的課程詳細說明
      { id:3, name:"分享分類", shortName:"courseTag",      input:["None", "None", "None",], canEdit:true,      display:true },   // 設定標籤，便於搜索，例如ECEN、編程
      { id:4, name:"分享地址", shortName:"courseAdres",    input:"None",                    canEdit:true,      display:true },   // 講者設定的課程地址
      { id:5, name:"分享時間", shortName:"courseTime",     input:["None", "None","None",],  canEdit:true,      display:true },   // 講者設定的課程舉辦時間，input[0]為date，input[1]為timeBegin，input[2]為timeEnd
      { id:6, name:"講師",     shortName:"speakerName",    input:"None",                    canEdit:false,     display:true },   // 講者設定名稱(可編輯) 或 直接獲取講者的名稱(不可編輯)
      { id:7, name:"講師id",   shortName:"speakerid",      input:"None",                    canEdit:false,     display:true },   // 講者的ARKid或UMid
      { id:8, name:"助手",     shortName:"helper",         input:[],                        canEdit:false,     display:true  },   // 同上
      { id:9, name:"追蹤人數", shortName:"followers",      input:"None",                    canEdit:false,      display:true  },    // 該分享受追蹤的人數
      { id:10, name:"課程狀態", shortName:"courseState",   input:"None",                    canEdit:false,      display:true  },    // 可設定為 "預備中", "講課中", "已結束"
      { id:11, name:"課程星級", shortName:"courseStars",   input:"None",                    canEdit:false,      display:true  },    // 將影響講者星級
      { id:12, name:"簽到密碼", shortName:"attendCode",    input:"None",                    canEdit:true,       display:true },    // 簡明易了
  ];
  let followMemberIdArr = [1];

  if (false) {
    
    db.collection('user') .where({
      arkid : _.in(followMemberIdArr),
    }) .field({
        _id : true
    }) .get() .then(res=>{
      let openIdArr = res.data.map((userInfo)=>{
        // 整理為對象數據傳入雲函數
        let SendData = {
            "thing12": {             // 主辦方
                "value": courseInfo[6].input
            },
            "thing2": {             // 活動名稱
                "value": courseInfo[1].input
            },
            "date3": {              // 活動日期
              "value": courseInfo[5].input[0]
              // "value": '2021-09-04'
            },
            "thing10": {             // 活動地點
                "value": courseInfo[4].input
            },
            "thing11": {            // 備註
                "value": '半個小時內即將開課！'
            },
        };
        // 發送訂閱雲函數
        cloud.callFunction({
            name:'subscribeMessageSend',
            data : {
                data        : SendData,
                templateId  : event.templateId,
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
  }
  console.log("執行一次");

}