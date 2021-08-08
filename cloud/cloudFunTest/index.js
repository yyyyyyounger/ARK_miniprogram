// 此雲函數用於無視權限的管理員更新數據庫多條記錄

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  db.collection('user').where({
    "userInfoInput.6.display" : true
  }) .update({
      data: {
        // createAt              : Date.now(),
        "userInfoInput.6.display" : false
      },
      success: function(res) {
        console.log(res.data)
      },
      fail: function(err) {
        console.error(err)
      }
  })

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}