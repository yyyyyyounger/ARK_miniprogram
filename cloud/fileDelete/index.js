// 該雲函數用於刪除課程信息中的文件，fileList集合的文件記錄，雲儲存文件

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  // 獲取課程狀態
  // 獲取課程id
  // let idNum           = event.idNum;
  let cloudFileIdArr  = event.cloudFileIdArr; // 待刪除的雲文件id數組

  // 刪除雲儲存文件
  const fileIDs = cloudFileIdArr    // 雲文件id，可刪除多個雲文件，最多50個
  await cloud.deleteFile({
    fileList: fileIDs,
  }) .then(res=>{
    // 刪除fileList集合的文件記錄
    db.collection('fileList') .where({
      'cloudFileId' : _.in(cloudFileIdArr)
    }) .remove() .catch(err=>{  console.error(err);  })

  }) .catch(err=>{
    console.error(err);
    return err
  })
    
}