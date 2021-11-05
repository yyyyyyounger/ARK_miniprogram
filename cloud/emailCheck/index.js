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

  let userName  =  event.userName ; // 'testName';
  let subject   =  event.subject;   // 'testSubject';
  let umId      =  event.umId;      // 'dc02581';
  let code      =  event.code;      // '4321';

 
  let result = await got(
    'http://mpserver.umeh.top/sendemailark/?username='+userName+'&umid='+umId+'&subject='+subject+'&code='+code
    // http://mpserver.umeh.top/sendemailark/?username='testName'&umid='testSubject'&subject='dc02581'&code='4321'
    ) 
    // .then(res=>{
    //   console.log(res);
    //   return res
    // }) .catch(err=>{
    //   console.error(err);
    //   return err
    // })

    return result.body

}