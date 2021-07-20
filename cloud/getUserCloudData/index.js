// ************
// 調用該雲函數，將返回數據庫user該用戶信息的記錄
// ************

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // **關鍵** 在解析時加上 await，應該是轉為同步操作？
  let userCloudData = await db.collection('user').where({
    _id : wxContext.OPENID,
  }) .get();

  return {
    userCloudData,
    // event,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }

}