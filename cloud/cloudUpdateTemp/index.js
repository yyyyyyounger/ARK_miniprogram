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
  let updateType = event.updateType;
  let updateData  = event.updateData;

  if (在config找不到對應的數據) {
    // 插入數據 - 未完成
    await db.collection('config').add({   // 對 user 集合插入新用戶數據
      data: {
        updateType,
        updateData,
      },
    })
  } else {    // 在config中更新對應數據
    // update 局部更新一個記錄
    // set 替換更新
    // 雲函數更新的寫法，數組需要用 . 引出索引
    db.collection('course').doc('cbddf0af60f04196170ea3cd011fd498').update({
      data: {
          'courseInfo_empty.0.input' : "Yes"
      },
      success: function(res) {
        console.log(res.data)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  }


  return {
    // event,
    openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}