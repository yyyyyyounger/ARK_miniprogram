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
        db.collection('course').add({
            data: {
                courseInfo_empty : this.data.courseInfo_empty
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
        db.collection('course').where({
            // _openid: 'oDWgf48GBbH1PqgkMMVIEHZldF60',
            // 只要有一個元素符合即返回
            courseInfo_empty : { input:"None", }
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
        db.collection('course').doc('cbddf0af60f04196170ea3cd011fd498').update({
            data: {
                'courseInfo_empty.0.input' : "Yes"
            },
            success: function(res) {
              console.log(res.data)
            },
            fail: function(res) {
              console.log(res)
            }
          })
    },
    deleteTest() {
        // 只能在雲函數端刪除多條記錄
        // 服務端只能刪除一條記錄
        wx.cloud.callFunction({     // 多記錄delete專用，最高權限
            name: 'cloudDeleteRecord',
            data:{
                folder : 'user',
                objectName : '_id',
                objectInfo : "b00064a760f0625227a1c374081cb672",
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
            success: (res) => {
                console.log(res.userInfo);
                let avatarUrl = res.userInfo.avatarUrl;
                let nickName  = res.userInfo.nickName;
                let gender    = res.userInfo.gender;        // 1：男        2：女
                wx.cloud.callFunction({
                    name: 'cloudGetUserInfo',
                    data:{
                        avatarUrl : avatarUrl,
                        nickName  : nickName,
                        gender    : gender,
                    },
                    complete: res => {
                      console.log('cloudGetUserInfo result: ', res)
                    }
                })
            }
        });
    },
    updateTemp () {
        // wx.cloud.callFunction({
        //     name: 'cloudUpdateTemp',
        //     data:{
        //         // folder : 'user',
        //         // objectName : '_id',
        //         // objectInfo : "b00064a760f0625227a1c374081cb672",
        //     },
        // }) .then(res=>{
        //     console.log(res);
        // }) .catch(res=>{
        //     console.error(res);
        // })
        wx.cloud.callFunction({         // 向數據庫插入user的empty數據
            name: 'cloudUpdateTemp',
            data:{
                writeMode : 'add',
                updateClass : 'course',
                updateName : 'userInfoInput',
                // updateName : 'userInfoInput_empty',
                updateData : cloudData.userInfoInput,
                // updateData : cloudData.userInfoInput_empty,
            },
        }) .then(res=>{
            console.log(res);
        }) .catch(res=>{
            console.error(res);
        })
    },
});