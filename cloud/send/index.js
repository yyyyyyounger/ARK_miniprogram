const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  cloud.callFunction({
      name:'subscribeMessageSend',
  }) .then(res=>{
      console.log("雲函數調用成功：",res.result);
  }) .catch(err=>{
      console.error("雲函數調用失敗：",err);
  })
}