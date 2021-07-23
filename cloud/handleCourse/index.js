// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  // 1 判斷主題、時間等信息是否與已有的分享重合
    // 是,返回錯誤提示.   否,繼續
    
  // 2 寫入課程暫存區,提示管理員審核
}