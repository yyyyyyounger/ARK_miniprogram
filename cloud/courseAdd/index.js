// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  // 1 判斷主題、時間等信息是否與已有的分享重合
    // 是,返回錯誤提示.   否,繼續
  await db.collection('course') .orderBy("_id","desc") .field({  _id:true  }) .limit(1) .get()
    .then(res=>{
      let courseId = res.data[0]._id;
      console.log("最新courseId為",courseId);
      console.log("賦值的courseId為",(parseInt(courseId)+1)+"");

      let courseInfoInput = event.courseInfoInput;
      courseInfoInput[0].input = (parseInt(courseId)+1)+"";

      db.collection('course').add({   // 對 user 集合插入新用戶的數據
        data: {
          _id         : (parseInt(courseId)+1)+"",
          _openid     : wxContext.OPENID,
          _createAt   : Date.now(),       // 當前時間戳
          // 通過前端傳入開課用戶的頭像、暱稱信息
          avatarUrl   : event.avatarUrl,
          nickName    : event.nickName,
          courseInfoInput ,
          allowVote          : event.allowVote,
          datePickArray   : event.datePickArray,
          timePickArray   : event.timePickArray,
        }
      }) .catch(err=>{  console.error(err);  })
    }) .catch(err=>{    
      return err;
    })


  // 2 寫入課程暫存區,提示管理員審核
}