// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {

  let myInfo = event.myInfo;
  myInfo.haveAttend = true;

  await db.collection('course').where({
    '_id': event.courseId,
    'followMember':_.elemMatch({ arkid : event.arkid}),
  }) 
  .update({
    data : {
      'followMember.$' : myInfo,
    }
  })
  .then(res=>{
    console.log(res.data);
  }) .catch(err=>{
    console.error(err);
  })

}