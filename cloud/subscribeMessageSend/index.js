const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": wxContext.OPENID,
        "templateId": 'cpl1QItBmdS4w43NRUeAjn-ZgDSulaaHk4IyMYRRhj4',
        "page" : './pages/index',
        "data": {
          "thing1": {             // 發起方
            "value": 'test1'
          },
          "thing6": {             // 活動名稱
            "value": 'test2'
          },
          "character_string10": { // 活動時間
            "value": 'test3'
          },
          "thing4": {             // 活動地點
            "value": 'test4'
          },
          "thing11": {            // 備註
            "value": 'test5'
          },
        },
      }) .then(res=>{
        return res;
      }) .catch (err=>{
        return err;
      })
    return result
  } catch (err) {
    return err
  }
}