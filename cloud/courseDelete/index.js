// 該雲函數用於課程編輯頁刪除課程。

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
  let courseState   = event.courseState;
  let speakerid     = event.speakerid;
  let followMember  = event.followMember;   // 此時的followMember應該是對象數組
  // 獲取課程id
  let idNum         = event.idNum;

  // 刪除course集合的 _id為idNum的課程
  db.collection('course') .doc(idNum) .remove() 
  .then(res=>{
    // 刪除user集合中myCourses的該課
    db.collection('user') .where({
      arkid : speakerid
    }) .update({
      data: {
        myCourses: _.pull(_.in([idNum]))
      }
    }) .then(res=>{
      console.log(res);
    }) .catch(err=>{  console.error(err);  })

    if (courseState=="finish") {      // if 課程狀態為finish，刪除記錄的followMember中的allJoinId - user的課程參與記錄
      db.collection('user') .where({
        arkid : _.in(followMember),
      }) .update({
        data: {
          allJoinId: _.pull(_.in([idNum])),
        }
      })
      // 4 刪除關聯文件 - 未測試
      db.collection('fileList') .where({
        'courseInfo.courseId' : idNum
      }) .field({  cloudFileId:true  }) .get() .then(res=>{
        let fileList = res.data.map(function(e,index,item){
          return cloudFileId
        })
        wx.cloud.deleteFile({
          fileList: fileList
        }).then(res => {
          console.log(res.fileList)
        }).catch(error => {
          console.error(error);
          return error
        })
      })
      
    } 
    else if (courseState=="opening"){  // 刪除user集合各個followMember中recentFollowIdIndex的該課
      db.collection('user') .where({
        arkid : _.in(followMember),
      }) .update({
        data: {
          recentFollowIdArray : _.pull(_.in([idNum])),
        }
      })
    }
  }) .catch(err=>{
    console.error(err);
    return err
  })
    
}