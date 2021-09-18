// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got'); //引用 got
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
// const db = cloud.database()
// const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
 
  let result = await got(
    'https://v1.hitokoto.cn/',
    {
      method: 'GET', //post请求
      headers: event.headers,
    }
    ) 

    return result.body

}