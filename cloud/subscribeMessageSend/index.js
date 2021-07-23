const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": wxContext.OPENID,
        "page": 'index',
        "lang": 'zh_CN',
        "data": {
          "number01": {
            "value": '339208499'
          },
          "date01": {
            "value": '2015年01月05日'
          },
          "site01": {
            "value": 'TIT创意园'
          },
          "site02": {
            "value": '广州市新港中路397号'
          }
        },
        "templateId": 'TEMPLATE_ID',
        "miniprogramState": 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}