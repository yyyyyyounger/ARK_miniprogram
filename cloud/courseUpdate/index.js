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

  let idNum = event.idNum;

  await db.collection('course') .doc(idNum) .update({   // 對 user 集合更新用戶新輸入的數據
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
      filePaths       : event.filePaths,
      memberLimit     : 50,
    }
  })
  .then(res=>{
    if (event.courseState=="finish" && event.followMember) {      // if 課程狀態為finish，結課後，將該課程的courseId寫入所有followMember的allJoinId內
      db.collection('user') .where({
        arkid     : _.in(event.followMember),
        allJoinId : _.nin([idNum]),         // 給不存在這節課的結課記錄的用戶增加記錄
      }) .update({
        data: {
          // 課程id寫入allJoinId
          allJoinId : _.push([idNum]),
          // 修改參與次數
          ['userInfoInput.'+event.joinTimesIndex+'.input'] : _.inc(1),
        }
      }) .then(res=>{
        // 修改主持次數
        db.collection('user') .where({  arkid : event.speakerId, }) .update({
          data: {
            // 修改參與次數
            ['userInfoInput.'+event.holdTimesIndex+'.input'] : _.inc(1),
          }
        })
      })
    } 
  }) 
  .catch(err=>{  console.error(err);  })

}