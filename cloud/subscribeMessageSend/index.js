const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": wxContext.OPENID,
        "templateId": 'W_ZYI60mhdcv9zbbIZUtsadXBAKKgdz0EmJqjiEO-9I',
        "page" : './pages/index',
        "data": {
          "thing2": {
            "value": 'test2'
          },
          "thing1": {
            "value": 'test1'
          },
          "time3": {
            "value": '15:01'
          },
          "thing4": {
            "value": 'test4'
          },
        },
        // "miniprogramState": 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}