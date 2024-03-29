// 多記錄delete專用雲函數

const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
});
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let objectClass = event.objectClass;
  let subjectName  = event.subjectName;
  
  await db.collection(objectClass) .where({
    [subjectName] : _.exists(true)
  }) 
  .remove()
  // .update({
  //     data: {
  //         [subjectName] : _.remove()
  //     }
  // }) 
  .then(res=>{
      console.log(res);
  }).catch(res=>{
      console.error(res);
  })


  // await db.collection('user') .where({
  //   arkid : _.in([1,11]),
  // }) .update({
  //   data: {
  //     myCourses: _.pull(_.in(['x'])),
  //   }
  // })
}