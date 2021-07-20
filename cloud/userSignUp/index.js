// ************
// 調用該雲函數，將初始化數據庫user集合用戶的資料（新增插入）
// ************

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let date = new Date(Date.parse(new Date()));    // Date.parse(new Date()) 和 Date.now()為當前時間戳 - 數字。new Date(時間戳)後化為帶有中文的字符串
  let today = date.toLocaleDateString();

  let userInfoTemp = event.userInfoInput;
  let arkIdIndex = userInfoTemp.findIndex(o=> o.shortName === 'arkId' ); // 準備插入最新arkid

  // 查找最新的arkid
  await db.collection('user') .orderBy("arkid","desc") .field({ arkid:true }) .limit(1) .get()
    .then(res=>{
      // console.log("最新arkid為",res.data[0].arkid);
      userInfoTemp[arkIdIndex].input = '00'+((parseInt(res.data[0].arkid)+1)+"");   // 插入最新的arkid
      db.collection('user').add({   // 對 user 集合插入新用戶的數據
        data: {
          _id         : wxContext.OPENID,
          _openid     : wxContext.OPENID,
          _createAt   : Date.now(),       // 當前時間戳
          arkid       : res.data[0].arkid+1,
          signUpDate  : today,
          // 通過前端傳入用戶的頭像、暱稱信息
          avatarUrl   : event.avatarUrl,
          nickName    : event.nickName,
          gender      : event.gender,
          // 前端傳入的用戶個人填寫的註冊信息
          userInfoInput : userInfoTemp,    // 前端更新isSignUp的狀態 - 但不夠安全
        }
      }) .then(res=>{
        let arkIdIndex = event.userInfoInput.findIndex(o=> o.shortName === 'arkId' );
        db.collection('user').doc(wxContext.OPENID).update({
          'userInfoInput.userInfoInput.input' : res.data[0].arkid+1
        })
      })
    }) .catch(res=>{    console.error(res);  })

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}