// 此雲函數用於無視權限的管理員更新數據庫多條記錄

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


  db.collection('course').add({
    data: {
        _id                         : 0,
        comment                     : '用於佔位，以下的課程都可以使用排序後+1的方法，_id用num表示',
        createAt                    : Date.now()
    },
  }).catch(err=>{
      console.error(err);
  })


  // db.collection('user').where({
  //   "userInfoInput.6.display" : true
  // }) .update({
  //     data: {
  //       // createAt              : Date.now(),
  //       "userInfoInput.6.display" : false
  //     },
  //     success: function(res) {
  //       console.log(res.data)
  //     },
  //     fail: function(err) {
  //       console.error(err)
  //     }
  // })

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}