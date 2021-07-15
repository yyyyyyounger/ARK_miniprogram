// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 前端才可以返回用戶頭像
  console.log(event);
  let avatarUrl = event.avatarUrl;
  let nickName  = event.nickName;
  let gender    = event.gender;

  await db.collection('user').add({   // 對 user 集合插入新用戶數據
    data: {
      avatarUrl,
      nickName ,
      gender ,
      openid: wxContext.OPENID,
      // appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    },
  })

  return {
    event,
    openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}