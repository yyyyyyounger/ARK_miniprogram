// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rq = require('request-promise');
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
// const db = cloud.database()
// const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  return await rq({
    method:'POST',
    uri: event.uri,
    headers: event.headers ? event.headers : {},
    body: event.body
  }).then(body => {
    return body
  }).catch(err => {
    return err
  })

}