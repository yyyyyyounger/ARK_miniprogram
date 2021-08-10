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

  // 1 查找最新courseid，作為該課程的courseid
  return await db.collection('course') .orderBy("_id","desc") .field({  id:true  }) .limit(1) .get()
  .then(res=>{
    let courseId = res.data[0]._id;
    console.log("數據庫最新courseId為",courseId);
    let thisCourseId = courseId+1;
    console.log("賦值的courseId為",thisCourseId);

    let courseInfoInput = event.courseInfoInput;
    courseInfoInput[0].input = thisCourseId;

    // 2 以該最新courseid寫入傳入的courseInfo
    db.collection('course').add({   // 對 user 集合插入新用戶的數據
      data: {
        _id         : thisCourseId,
        _openid     : wxContext.OPENID,
        _createAt   : Date.now(),       // 當前時間戳
        // 通過前端傳入開課用戶的頭像、暱稱信息
        avatarUrl   : event.avatarUrl,
        nickName    : event.nickName,
        arkid       : event.arkid,
        courseInfoInput ,
        allowVote       : event.allowVote,
        datePickArray   : event.datePickArray,
        timePickArray   : event.timePickArray,
        timeStampPick   : event.timeStampPick,
        courseState     : "checking",
        memberLimit     : 50,
      }
    }) .then(res=>{
      // 3 在user集合寫入myCourse，作記錄
      db.collection('user') .doc(wxContext.OPENID) .update({
        data: {
          myCourses : _.push([thisCourseId]),
        },
      }) .catch(err=>{
        console.error(err);
        return err;
      })
    }) .catch(err=>{  console.error(err);  })
    
    return thisCourseId
    
  }) .catch(err=>{  return err; })
}