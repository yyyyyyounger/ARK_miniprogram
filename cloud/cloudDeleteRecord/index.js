// 多記錄delete專用雲函數

const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
});
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let folder      = event.folder;
  let objectName  = event.objectName;
  let objectInfo  = event.objectInfo;
  try {
    return await db.collection(folder).where({
      [objectName]: objectInfo
    }).remove()
  } catch(e) {
    console.error(e)
  }
}