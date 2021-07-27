// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // let courseCloudData = await db.collection('course') .orderBy("_id","desc") .field({ _id:true }) .limit(1) .get()
  //   .then(res=>{
  //     console.log(res.data[0]._id);
  //   })
  //   .catch(err=>{
  //     console.error(err);
  //   })


  // **關鍵** 在解析時加上 await，應該是轉為同步操作？
  let courseCloudData = await db.collection('course').where({
    _id : event.courseId,
  }) .get();

  return {
    courseCloudData,
    // event,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}