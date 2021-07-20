// ************
// 調用該雲函數，更新user集合的用戶信息
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

  await db.collection('user').doc(wxContext.OPENID) .update({   // 對 user 集合插入新用戶的數據
    data: {
      // 通過前端傳入用戶的頭像、暱稱信息
      avatarUrl   : event.avatarUrl,
      nickName    : event.nickName,
      // 前端傳入的用戶個人填寫的註冊信息
      userInfoInput : event.userInfoInput,    // 前端更新isSignUp的狀態 - 但不夠安全
    }
  }) .catch(err=>{
    return console.error(err);
  })

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}