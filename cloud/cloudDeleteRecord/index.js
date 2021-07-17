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
  let subjectInfo  = event.subjectInfo;
  try {
    return await db.collection(objectClass).where({
      [subjectName]: subjectInfo
    }).remove()
  } catch(e) {
    console.error(e)
  }
}