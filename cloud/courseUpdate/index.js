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
      memberLimit     : 50,
    }
  }) .then(res=>{
    
  }) .catch(err=>{  console.error(err);  })
    
}