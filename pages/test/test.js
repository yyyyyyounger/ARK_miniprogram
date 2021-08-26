var app = getApp();
const db = wx.cloud.database();
const _ = db.command
const { courseInfo_empty } = require('../../data/cloud.js');
var cloudData = require('../../data/cloud.js')

Page({
    data: {
        
    },
    //options(Object)
    onLoad: function(options){
        this.setData({
            courseInfo_empty : cloudData.courseInfo_empty
        })

        if (false) {
            wx.cloud.uploadFile({
                cloudPath: 'test1.png',
                filePath: 'pages/index/image/test.png', // 文件路径
                success: res => {
                  // get resource ID
                  console.log(res.fileID)
                },
                fail: err => {
                  // handle error
                }
            })
        }

        // 請求學生會網站介紹的IET的代碼
        // wx.request({
        //   url: 'https://umsu.org.mo/%e9%99%84%e5%b1%ac%e7%b5%84%e7%b9%94/%e5%b7%a5%e7%a8%8b%e5%8f%8a%e7%a7%91%e6%8a%80%e5%ad%b8%e6%9c%83%e9%a6%99%e6%b8%af%e5%88%86%e6%9c%83%e9%9d%92%e5%b9%b4%e6%9c%83%e5%93%a1%e9%83%a8%e6%be%b3%e9%96%80%e5%ad%b8%e7%94%9f%e6%94%af%e9%83%a8/',
        //   method : 'GET',
        // //   header : {
        // //     'Host': "umsu.org.mo",
        // //     'Referer': "https://umsu.org.mo/%e9%99%84%e5%b1%ac%e7%b5%84%e7%b9%94/",
        // //   },
        //   success (res) {
        //       console.log(res.data);
        //   },
        //   fail (err) {
        //       console.error(err);
        //   }
        // })
        
    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },
    onPullDownRefresh : function() {
        app.toastLoadingDIY();
        // setTimeout(() => {
        this.onLoad("refresh");
        // }, 2500);
        setTimeout(() => {
          wx.stopPullDownRefresh();
        }, 1000);
    },

    // 雲函數test
    addTest(){
        db.collection('course').add({
            data: {
                _id                         : 0,
                comment                     : '用於佔位，以下的課程都可以使用排序後+1的方法，_id用num表示',
                createAt                    : Date.now()
            },
        }).catch(err=>{
            console.error(err);
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
        db.collection('user').doc('') .update({
            data: {
                // createAt              : Date.now(),
                "userInfoInput.6.display" : false
            },
            success: function(res) {
              console.log(res.data)
            },
            fail: function(err) {
              console.error(err)
            }
        })
    },
    deleteTest() {
        let objectClass = 'user';
        let subjectName = 'recentFollowCourseArray';
        // 刪除多條記錄只能在雲函數端進行
        // 服務端只能刪除一條記錄
        wx.cloud.callFunction({     // 多記錄delete專用，最高權限
            name: 'cloudDeleteRecord',
            data:{
                objectClass : 'fileList',
                subjectName : 'arkid',
            },
            complete: res => {
              console.log('result: ', res)
            }
        })
        
    },
    cloudGetUserInfo() {
        wx.getUserProfile({
            desc: '展示用戶信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        })
        .then (res => {
            // wx.cloud.callFunction({
            //     name: 'userSignUp',
            //     data:{
            //         avatarUrl : res.userInfo.avatarUrl,
            //         nickName  : res.userInfo.nickName,
            //         gender    : res.userInfo.gender,        // 1：男        2：女
            //         userInfoInput    : cloudData.userInfoInput,
            //     }
            // }) .then(res=>{    console.log('userSignUp result: ', res)    })
            console.log(res.userInfo);
            wx.setStorageSync('userInfo', { time:Date.now(),  data: res.userInfo});
        }) .catch (res=>{   console.error(res);   })
    },
    updateTemp () {
        wx.cloud.callFunction({
            name: 'cloudFunTest',
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

    subscribeTest() {   // 推送
        wx.requestSubscribeMessage({
            tmplIds: ['cpl1QItBmdS4w43NRUeAjn-ZgDSulaaHk4IyMYRRhj4'],
            success (res) {
                // 不管點擊允許還是取消，都會執行success的回調函數
                console.log("用戶同意接受推送：",res);
                wx.cloud.callFunction({
                    name:'subscribeMessageSend',
                }) .then(res=>{
                    console.log("雲函數調用成功：",res.result);
                }) .catch(err=>{
                    console.error("雲函數調用失敗：",err);
                })
            },
            fail (err) { console.error(err);},
        })
    },

    // 跳轉選咩課
    toOtherMiniProgram() {
        wx.navigateToMiniProgram({
            appId: 'wxd2449edafe0c532a',//要打开的小程序 appId
            path: '',//打开的页面路径，如果为空则打开首页。
            success(res) {
              // 打开成功
              console.log("跳轉成功");
            }
          })
    },
    
    jumpToCourseDetail () { // 带參跳轉頁面
        // 跳轉課程詳情頁
        let detailInfo = {
            user:"speaker",
            courseId:5,
        }
        detailInfo = JSON.stringify(detailInfo);
        wx.redirectTo({
        url: '../category/courseDetail/courseDetail?detailInfo=' + detailInfo,
        })
    },

    // 郵箱查驗
    emailCheck() {
        wx.cloud.callFunction({     // 多記錄delete專用，最高權限
            name: 'emailCheck',
            data:{
                userName:'林展揚',
                subject:'某一課',
                umId:'dc02581',
                code:'5678',
            },
            complete: res => {
              console.log('result: ', res)
              if (res.result=='success') {
                //   發送成功
              }
            }
        })
        
    },

    // 圖片預覽
    clickImg: function(e){
        console.log(e);
        // var imgUrl = this.data.imgUrl;
        var imgUrl = 'https://public-cdn.mokahr.com/f9c78d80-2e7f-4680-8086-9301233bfa4e.jpeg';
        wx.previewImage({
          urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
          current: '', // 当前显示图片的http链接，默认是第一个
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
    },
});