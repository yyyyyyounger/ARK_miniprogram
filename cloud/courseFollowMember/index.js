// ************
// 調用該雲函數，將在user集合的本user處更新recentFollowCourseArray
// ************

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 現在的時間戳
  let timeStamp = Date.parse(new Date());

  // 如果超過開始時間，禁止再操作
  if (timeStamp <= event.endTimeStamp) {
    // add則寫入followMember數組，delete則刪除
    if (event.mode=="add") {    // 將該user的基本信息導入到該courseId的followMember數組內
      await db.collection('course').doc(event.selectCourse).update({
        data: {
          followMember : _.push([{
            arkid     : event.arkid,
            avatarUrl : event.avatarUrl,
            name      : event.name,
          }]),
        }
      })
    }
    else {                      // 刪除該courseId的followMember數組內的user基本信息
      await db.collection('course').doc(event.selectCourse).update({
        data: {
          followMember : _.pull( {
            arkid     : _.eq(event.arkid),
          } ),
        }
      })
    }
  }

}