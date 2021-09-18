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

        // 訂閱信息定時觸發條件測試
        if (false) {
            let nowTimeStamp = Date.parse(new Date('2021-09-04 16:00'));
            console.log("當前時間",nowTimeStamp, new Date(nowTimeStamp) );
            let beginTimeStamp = Date.parse(new Date('2021-09-04 17:15'));
            let sendTimes=0;
    
            for (let i = 0; beginTimeStamp+15*4*60*1000 > nowTimeStamp; i++) {
                if (i!=0) {
                    nowTimeStamp += 15*60*1000;
                    console.log("15分鐘後",nowTimeStamp, new Date(nowTimeStamp));
                }
                let timeDiff = beginTimeStamp - nowTimeStamp;
                // 30分鐘內提醒2次
                if ( 0<timeDiff && timeDiff<=30.5*60*1000 ) {
                    console.log("於",new Date(nowTimeStamp),"提醒");
                    sendTimes++
                }
            }
            console.log('總共提醒了',sendTimes,'次');
        }
        
        // this.readyToSend();

        if (false) {
            wx.cloud.callFunction({
                name:'send'
            }) .then(res=>{
                console.log("雲函數調用成功：",res.result);
            }) .catch(err=>{
                console.error("雲函數調用失敗：",err);
            })
        }

        wx.cloud.callFunction({
            name:'httpPost',
            data: {
                uri:'https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo.zone:refreshzone',
                headers: {
                    'Host': "campusloop.cmdo.um.edu.mo",
                    'X-Requested-With': "XMLHttpRequest",
                    'Origin': "https://campusloop.cmdo.um.edu.mo",
                    'Referer': "https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo",
                },
            }
        }).then(rqRes => {
            // console.log(rqRes)
            const data = JSON.parse(rqRes.result)
            // console.log(data)
            let result = data._tapestry.content[0][1];
            console.log(result);
        })
    },
    onShow: function(){
        
    },
    onPullDownRefresh : function() {
        Toast.loading({
            message: '拼命加載中...',
            forbidClick: true,
        });
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

    subscribeTest() {   // 推送 訂閱
        wx.requestSubscribeMessage({
            tmplIds: ['cpl1QItBmdS4w43NRUeAjn-ZgDSulaaHk4IyMYRRhj4'],
            success (res) {
                console.log('success');
                console.log(res);
            },
            fail (err) { console.error(err);},
        })
    },
    // 搜索符合觸發send訂閱條件的course
    readyToSend () {
        let nowTimeStamp = Date.now();
        // 查courseState為'opening'的課，且 0< 開始時間-nowTimeStamp <=30.5min
        db.collection('course') .where({
            courseState     : 'opening',
            followMember    : _.exists(true),
            // 0< 開始時間-nowTimeStamp <=30.5min
            timeStampPick   : _.gt(nowTimeStamp).and(_.lte(30.5*60*1000+nowTimeStamp)),
        }) .field({
            _id             : true,
            courseInfoInput : true,
            followMember    : true,
            timePickArray   : true,
            timeStampPick   : true,
        }) .get()
        .then(res=>{
            let result = res.data;
            if (result.length != 0) {   // 未來半小時內有課程要開始，觸發訂閱雲函數
                result.map((item)=>{
                    let courseInfo      = item.courseInfoInput;
                    let courseId        = item._id;
                    let beginTime       = item.timePickArray[0].begin;
                    let followMember    = item.followMember;
                    console.log("課程id ",courseId," ，將在 ",beginTime," 開始，有",followMember.length,"個用戶需要推送訂閱消息");
                    let followMemberIdArr = followMember.map((e)=>{
                        return e.arkid;
                    })
                    console.log("將要發送推送的純arkid數組",followMemberIdArr);

                    if (false) {
                        db.collection('user') .where({
                            arkid : _.in(followMemberIdArr),
                        }) .field({
                            _id : true
                        }) .get() .then(res=>{
                            let openIdArr = res.data.map((userInfo)=>{
                                if (false) {
                                    // 整理為對象數據傳入雲函數
                                    let SendData = {
                                        "thing12": {             // 主辦方
                                            "value": courseInfo[6].input
                                        },
                                        "thing2": {             // 活動名稱
                                            "value": courseInfo[1].input
                                        },
                                        "date3": {              // 活動日期
                                            "value": courseInfo[5].input[0]
                                            // "value": courseInfo[5].input[0]+courseInfo[5].input[1]+'~'+courseInfo[5].input[2]
                                        },
                                        "thing10": {             // 活動地點
                                            "value": courseInfo[4].input
                                        },
                                        "thing11": {            // 備註
                                            "value": '半個小時內即將開課！'
                                        },
                                    };
                                    // 發送訂閱雲函數
                                    wx.cloud.callFunction({
                                        name:'subscribeMessageSend',
                                        data : {
                                            data        : SendData,
                                            templateId  : app.globalData.tmplIds[0],
                                            OPENID      : userInfo._id,
                                            courseId    : courseId,
                                        }
                                    }) .then(res=>{
                                        console.log("雲函數調用成功：",res.result);
                                    }) .catch(err=>{
                                        console.error("雲函數調用失敗：",err);
                                    })
                                }
                                return userInfo._id;
                            })
                            console.log("將要發送推送的純OPENID數組",openIdArr);
                        })
                    }
                })
                console.log("所有符合推送訂閱條件的課程",result);
            } else{                     // 未來半小時沒有課程要開始
                console.log("沒有符合條件的課程數據，不需要提醒訂閱。");
            }
        })
        .catch(err=>{
            console.error(err);
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
                userName:'fgg',
                subject:'fgg好tm帥',
                umId:'db92534',
                code:'4396',
            },
            success: res=>{
                console.log("調用成功");
            },
            complete: res => {
              console.log('result: ', res)
              if (res.result=='success') {
                //   發送成功
                console.log("Email發送成功");
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