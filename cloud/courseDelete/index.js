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

  let courseState   = event.courseState;    // 獲取課程狀態
  let speakerid     = event.speakerid;
  // let followMember  = event.followMember;   // 此時的followMember應該是對象數組
  let idNum         = event.idNum;          // 獲取課程id

  // 刪除course集合的 _id為idNum的課程
  await db.collection('course') .doc(idNum) .remove() 
  .then(res=>{
    // 刪除user集合中myCourses的該課，將主持次數-1
    db.collection('user') .where({
      arkid : speakerid
    }) .update({
      data: {
        myCourses : _.pull(idNum),
        ['userInfoInput.'+event.holdTimesIndex+'.input'] : _.inc(courseState=='finish'?-1:0),   // 主持次數-1
      }
    }) .then(res=>{
      console.log(res);
    }) .catch(err=>{  console.error(err);  })
    
  }) .catch(err=>{
    console.error(err);
    return err
  })

  // 刪除關聯文件 & fileList集合記錄
  await db.collection('fileList') .where({
    'courseInfo.courseId' : idNum
  }) .field({  cloudFileId:true  }) .get() .then(res=>{
    if (res.data.length!=0) {
      let fileList = res.data.map(function(e,index,item){
        return e.cloudFileId
      })
      cloud.deleteFile({
        fileList: fileList
      }).then(res => {
        console.log("已刪除文件：",res.fileList);
        // 刪除fileList集合的記錄
        db.collection('fileList').where({
          'courseInfo.courseId' : idNum
        }) .remove()
      }).catch(error => {
        console.error(error);
        return error
      })
    } else{
      console.log("無上傳文件");
    }
  })
    
}

  // 刪除記錄的followMember中的allJoinId - user的課程參與記錄 - 21/9/11修改為不刪除
  // if (followMember!=[0]) {
  //   await db.collection('user') .where({
  //     arkid : _.in(followMember),
  //   }) .update({
  //     data: {
  //       allJoinId           : _.pull(_.in([idNum])),
  //       recentFollowIdArray : _.pull(_.in([idNum])),
  //     }
  //   }) .then(res=>{
  //     console.log(res);
  //   }) .catch(err=>{
  //     console.error(err);
  //     return err
  //   })
  // }