// 該雲函數用於課程編輯頁提交更新課程信息。

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

  db.collection('course') .doc(event.idNum) .update({   // 對 user 集合更新用戶新輸入的數據
    data: {
      // 通過前端傳入開課用戶的頭像、暱稱信息
      avatarUrl   : event.avatarUrl,
      nickName    : event.nickName,
      arkid       : event.arkid,
      courseInfoInput : event.courseInfoInput,
      allowVote       : event.allowVote,
      datePickArray   : event.datePickArray,
      timePickArray   : event.timePickArray,
      timeStampPick   : event.timeStampPick,
      courseState     : event.courseState,
      fileList        : event.fileList,
      memberLimit     : 50,
    }
  }) .then(res=>{
    if (courseState=="finish") {      // if 課程狀態為finish，結課後，將該課程的courseId寫入所有followMember的allJoinId內
      db.collection('user') .where({
        arkid : _.in(followMember),
      }) .update({
        data: {
          allJoinId: _.push([idNum]),
        }
      })
    } 
  }) .catch(err=>{  console.error(err);  })
    
}