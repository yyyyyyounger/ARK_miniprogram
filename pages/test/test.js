const db = wx.cloud.database();
var cloudData = require('../../data/cloud.js')

Page({
    data: {
        
    },
    //options(Object)
    onLoad: function(options){
        this.setData({
            courseInfo_empty : cloudData.courseInfo_empty
        })

        

    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },

    // 雲函數test
    addTest(){
        db.collection('config').add({
            data: {
                _id                 : 'userInfoArray1.0.0',
                userInfoInput_empty : cloudData.userInfoInput_empty,
            },
        }).then(res => {
            console.log("插入",res)
        })
    },
    searchTest() {
        // 以 _id 獲取某條記錄
        // db.collection('course').doc('cbddf0af60f04196170ea3cd011fd498').get().then(res => {
        //     // res.data 包含该记录的数据
        //     console.log("查詢",res.data)
        // })

        // 搜索符合 where中條件的記錄
        // 此外還可使用查詢指令：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/query.html
        db.collection('user').where({
            _openid: 'oDWgf48GBbH1PqgkMMVIEHZldF60',
            // _id: 'oDWgf48GBbH1PqgkMMVIEHZldF60',
            // _id                 : 'userInfoArray1.0.0',
            // courseInfo_empty : { input:"None", }
        })
        .get({
            success: function(res) {
                console.log(res.data)
            }
        })
    },
    updateTest() {
        // update 局部更新一個記錄
        // set 替換更新
        // 雲函數更新的寫法，數組需要用 . 引出索引
        // db.collection('course').doc('cbddf0af60f04196170ea3cd011fd498').update({
        //     data: {
        //         'courseInfo_empty.0.input' : "Yes"
        //     },
        //     success: function(res) {
        //       console.log(res.data)
        //     },
        //     fail: function(res) {
        //       console.log(res)
        //     }
        // })
    },
    deleteTest() {
        // 刪除多條記錄只能在雲函數端進行
        // 服務端只能刪除一條記錄
        wx.cloud.callFunction({     // 多記錄delete專用，最高權限
            name: 'cloudDeleteRecord',
            data:{
                objectClass : 'user',
                subjectName : '_id',
                subjectInfo : "b00064a760f0625227a1c374081cb672",
            },
            complete: res => {
              console.log('result: ', res)
            }
        })
        // db.collection('user').doc('b00064a760f0625227a1c374081cb672').remove().then(res=>{
        //     console.log(res);
        // }).catch(res=>{
        //     console.error(res);
        // })
    },
    cloudGetUserInfo() {
        wx.getUserProfile({
            desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        })
        .then (res => {
            wx.cloud.callFunction({
                name: 'userSignUp',
                data:{
                    avatarUrl : res.userInfo.avatarUrl,
                    nickName  : res.userInfo.nickName,
                    gender    : res.userInfo.gender,        // 1：男        2：女
                    userInfoInput    : cloudData.userInfoInput,
                }
            }) .then(res=>{    console.log('userSignUp result: ', res)    })
        }) .catch (res=>{   console.error(res);   })
    },
    updateTemp () {
        wx.cloud.callFunction({         // 向數據庫插入user的empty數據
            name: 'cloudUpdateTemp',
            data:{
                writeMode : 'update',
                updateClass : 'course',
                updateName : 'userInfoInput',
                // updateName : 'userInfoInput_empty',
                updateData : cloudData.userInfoInput,
                // updateData : cloudData.userInfoInput_empty,
                recordId : '79550af260f1b203272518e7532568a2',
            },
        }) .then(res=>{
            console.log(res);
        }) .catch(res=>{
            console.error(res);
        })
    },

    subscribeTest() {
        wx.requestSubscribeMessage({
            tmplIds: ['W_ZYI60mhdcv9zbbIZUtsadXBAKKgdz0EmJqjiEO-9I'],
            success (res) {
                console.log(res);
            },
            fail (res) { console.error(res);},
        })
    },
});