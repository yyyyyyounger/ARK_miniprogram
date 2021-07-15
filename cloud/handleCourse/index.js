// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('user').add({
      data:{
        filed1:"filedvalue1",
        filed2:"filedvalue2"
      }
    })
  } catch (e) {
    console.log("xxxxxxx",e)
  }
}