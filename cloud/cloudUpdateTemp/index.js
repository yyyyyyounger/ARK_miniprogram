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
  let writeMode  = event.writeMode;
  let updateClass = event.updateClass;  // 數據庫中集合的名稱
  let updateName  = event.updateName;
  let updateData  = event.updateData;
  let recordId  = event.recordId;

  switch (writeMode) {
    case 'add':
      db.collection(updateClass).add({
        data: {
          [updateName] : updateData,
          _id          : recordId,
        },
      }) .then(res=>{
        return res;
      })
      break;
    case 'update':
      db.collection(updateClass).doc(recordId).update({   // update方法可以向已存在的記錄增添字段
        data: {      [updateName] : updateData      },
      }) .then(res=>{
        return res;
      })
      break;
    default:
      break;
  }

  return {
    // event,
    openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}