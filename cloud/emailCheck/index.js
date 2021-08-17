// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got'); //引用 got
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

    // 發郵件test
    // wx.request({
    //   url: 'https://mpserver.umeh.top/sendemailark',
    //   data: {
    //     user: 'testName',
    //     id: 'dc02581' ,
    //     code: '1234' ,
    //   },
    //   method : 'GET',
    //   success (res) {
    //     console.log("郵件請求返回：",res)
    //   },
    //   fail (err) {
    //     console.error(err);
    //   }
    // })
 
    let result = await got('https://mpserver.umeh.top/sendemailark', { 
         method: 'GET',
         data: {
            user: 'testName',
            id: 'dc02581' ,
            code: '1234' ,
         }
       })
    console.log(result);
    return result //返回数据

}