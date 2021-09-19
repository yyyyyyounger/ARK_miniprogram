var app = getApp();
const db = wx.cloud.database();   // 數據庫
const _ = db.command

import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

let userAttendCodeInput;
let attendCode;

Page({
  data: {
    // 未登錄狀態的空arkid
    userCloudData :{
      arkid : 0
    },
    // follow狀態
    haveFollow : false,
    // 骨架屏
    loading:true,
    // 步驟條 - begin
    numList: [{
      name: '填寫信息'
      }, {
        name: '提交管理員審核'
      }, {
        name: '課程發佈'
      }, 
    ],
    stepsActive:1,    // 控制步驟條active
    // 步驟條 - end
  },
  onLoad: function(options){
    this.app = getApp();
    // 獲取上個頁面傳遞的參數，說明用戶組和需要渲染的courseId
    let detailInfo = JSON.parse(options.detailInfo);
    this.setData({  detailInfo  })
    console.log("上個頁面傳遞值為：",this.data.detailInfo)

    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    if (userCloudDataStorage) {
      // 從緩存中獲取該用戶是否管理員
      this.setData({
        admin         : userCloudDataStorage.data.admin,
        userCloudData : userCloudDataStorage.data,
      })
    } 

    // 轉發按鈕所必須
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow() {
    this.setData({  nowTimeStamp : Date.now()  })

    // 請求雲端的courseInfo數據，該courseId為num類型
    this.returnCourseData();
  },

  // 請求數據庫返回該courseId的數據
  returnCourseData (){
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存

    // 請求雲端的courseInfo數據，該courseId為num類型
    db.collection('course') .doc(this.data.detailInfo.courseId) .field({
      _openid   : false,
      _createAt : false,
      nickName  : false,
    }) .get()
    .then(res=>{
      console.log("該courseId在數據庫儲存的數據為：",res.data);
      this.setData({  courseCloudData : res.data  })
      this.setData({  courseInfoInput : this.data.courseCloudData.courseInfoInput  })
      // 數據操作數組、對象等便利操作法的初始化
      this.ArrayDataInit(this);

      // 查詢該課程是否設置密碼簽到
      let attendCodeSetting = this.data.courseInfoInput[this.data.shortNameIndex.attendCode].input ;
      if ( attendCodeSetting != undefined && attendCodeSetting != 'None' && attendCodeSetting != 'NaN' ) {
        console.log("該課程設定了密碼簽到！");
        this.setData({    haveSetCode : true,  })
        attendCode = attendCodeSetting;
        console.log("簽到密碼為：",attendCode);
      } else{
        this.setData({    haveSetCode : false,  })
        // this.setData({  attendCode : undefined  })
        attendCode = undefined;
        console.log("該課程沒有設定密碼簽到！");
      }


      // 獲取follow狀態，刷新前台顯示
      let followMember = this.data.courseCloudData.followMember;
      if (followMember && userCloudDataStorage) {
        // 判斷是否follow了該課程，follow狀態更改wxml的按鈕形態
        followMember.forEach((item)=>{
          if(item.arkid==userCloudDataStorage.data.arkid){
              console.log("這個用戶已follow了這個課程！");
              this.setData({  haveFollow : true  })
              // 獲取attend狀態
              if (item.haveAttend) {
                this.setData({  haveAttend : true  })
              }
          }
        })
      } else {
        this.setData({  haveFollow : false  })
      }

      this.setData({  loading: false,  }) // 骨架屏消失
      Toast.success('加載成功');
    }) .catch(err=>{  console.error(err);  })
  },
  // 匹配shortName對象，單個渲染/設定時適用對象，for循環時適用數組
  findSetData(shortNameArray) {
    // 匹配出shortName的index，生成為一個對象形式
    let shortNameIndex={};
    this.data.courseInfoInput.map(function (e, item) {    // 究極優化！本質上一行代碼匹配出所有index
      shortNameIndex[e.shortName] = e.id;
    });
    this.setData({  shortNameIndex  })

    // 匹配出shortName的display權限，生成為一個對象形式
    let shortNameDisplay={};
    this.data.courseInfoInput.map(function (e, item) {
      shortNameDisplay[e.shortName] = e.display;
    });
    this.setData({  shortNameDisplay  })
    // console.log("shortNameDisplay為",shortNameDisplay);
  },
  // 初始化各種數組
  ArrayDataInit(that) {
    // 生成 無input版 courseInfo的shortName數組
    let shortNameArray = that.data.courseInfoInput.map((item)=>{    return item.shortName   });
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = that.data.courseInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = that.data.courseInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    that.setData({    InfoDisplay, canEdit, shortNameArray    });
    // 初始化所有index值
    that.findSetData(shortNameArray);
  },

  onPullDownRefresh: function(){
    Toast.loading({
      message: '拼命加載中...',
      forbidClick: true,
      duration : 0,
    })

    this.returnCourseData();

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onShareAppMessage: function(){
    // 點擊轉發卡片正確跳轉
    let that =this;
    let detailInfo = {
      courseId  :   that.data.courseCloudData._id,
    }
    detailInfo = JSON.stringify(detailInfo);

    return {
      title : 'ARK分享：'+that.data.courseCloudData.courseInfoInput[1].input,
      path  : '/pages/category/courseDetail/courseDetail?detailInfo=' + detailInfo, //这里拼接需要携带的参数
      // imageUrl:'https://ceshi.guirenpu.com/images/banner.png', // 可自定義背景圖
      success:function(res){
        console.log("转发成功"+res);
      },
      fail:function(err){
        console.error(err);
      }
    }

  },

  addFollow (e) {
    const userCloudDataStorage = wx.getStorageSync('userCloudData');
    if (userCloudDataStorage) {    // 已登錄才可以操作
      Dialog.confirm({
        title: '操作提示',
        message: '自己follow的課要好好上完喔！😎',
        zIndex:99999999,
      })
      .then(res=>{            // on confirm
        app.checkSubscribe();
        // 加載提示
        Toast.loading({
          message: '拼命加載中...',
          forbidClick: true,
        });
        // 正常應該只能follow 20節課，獲取資料的時候默認20條記錄限制 - 好像沒有寫
        
        let selectCourse = this.data.courseCloudData._id;  // 記錄Follow的課程id
        console.log("請求add",selectCourse);
    
        // 雲函數更新 - user集合 - recentFollowIdArray數組
        const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
        // 權限問題需要調用雲函數
        // user基本信息導入到該courseId的followMember數組內
        wx.cloud.callFunction({
          name : 'courseFollowMember',
          data : {
            mode          : "add",
            selectCourse  : selectCourse,
            endTimeStamp  : this.data.courseCloudData.timeStampPick,
            arkid         : userCloudDataStorage.data.arkid,
            avatarUrl     : userCloudDataStorage.data.avatarUrl,
            name          : userCloudDataStorage.data.userInfoInput[1].input,
          }
        }) .then(res=>{         // 寫入自己的follow列表
          db.collection('user').doc(userCloudDataStorage.data._openid).update({
            data: {
              recentFollowIdArray: _.push([selectCourse]),
            }
          }) .then(res=>{       // 成功提示 & 同步wxml的顯示
            Toast('Follow成功！課程編號：'+selectCourse+'\n可前往 “我的Follow” 查看');
            this.setData({  haveFollow : true  })
          })
        }) .catch(err=>{        // 失敗提示
          console.error(err);
          Notify({ type: 'warning', message: '操作失敗！請刷新頁面或聯繫管理員！' });
        })
        
        // 詢問是否同意微信訂閱 開課消息
      })                      // on confirm - end
      .catch(res=>{           // on cancel
      })
    }
    else {                  // 未登錄提示登錄
      Dialog.confirm({
        title: '操作提示',
        message: '該功能需要註冊後操作！\n現在去登錄嗎？',
        zIndex:99999999,
      })
      .then(() => {   // on confirm
        wx.switchTab({
          url: '../../user/user',
        })
      })
      .catch(() => {  // on cancel
        
      });
    }
  },
  deleteFollow(e){
    // 防誤觸式提問
    Dialog.confirm({
      title: '重要提示',
      message: '就這麼忍心說ByeBye嗎？😭',
      zIndex:99999999,
    })
    .then(() => {     // on confirm
      Toast.loading({   // 加載提示
        message: '拼命加載中...',
        forbidClick: true,
      });

      // 記錄Follow的課程id
      let selectCourse = this.data.courseCloudData._id;
      console.log("請求delete",selectCourse);

      // 調用雲函數更新 - user集合 - recentFollowIdArray數組
      const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
      wx.cloud.callFunction({   // 刪除followMember數組內該user的arkid等數據
        name : 'courseFollowMember',
        data : {
          mode          : "delete",
          endTimeStamp  : this.data.courseCloudData.timeStampPick,
          selectCourse  : selectCourse,
          arkid         : userCloudDataStorage.data.arkid,
        }
      }) .then(res=>{           // 刪除自己的follow列表
        db.collection('user').doc(userCloudDataStorage.data._openid).update({
          data: {
            recentFollowIdArray: _.pull(_.in([selectCourse]))
          }
        }) .then(res=>{         // 成功提示 & 同步wxml的顯示
          Toast('刪除成功！');
          this.setData({  haveFollow : false  })
        }) .catch(err=>{ console.error(err); })
      }) .catch(err=>{             // 失敗提示
        console.error(err);
        Notify({ type: 'warning', message: '操作失敗！請刷新頁面或聯繫管理員！' });
      })
    })  // on confirm - end
    .catch(() => {    // on cancel
    });
  },

  // 簽到邏輯
  takeAttend() {  // 喚起dialog彈窗
    if (!this.data.haveSetCode && this.data.haveFollow && this.data.userCloudData) {    // 已follow，且不需簽到密碼，且到了開始時間的前15分鐘
      // 執行雲函數，對該課程的followMember的自己寫入 haveAttend:true
      this.submitAttendCode('noAttendCode');
    }
    else if ( this.data.haveSetCode && this.data.haveFollow && this.data.userCloudData ) {
      this.setData({ show_attend: true });
    }
    else if ( !this.data.userCloudData ){
      Toast.fail('請先登錄')
    }
    else{
      if (this.data.courseCloudData.arkid == this.data.userCloudData.arkid) {
        Toast.fail('好好講課')
      } else {
        console.log('需要輸入簽到密碼');
        this.setData({ show_attend: true });
      }
    }
  },
  onClose_dialog() {  // 關閉dialog彈窗
    this.setData({ show_attend: false });
  },
  // 獲取用戶輸入的簽到密碼
  attendCodeInput(e) {
    // 雲端的簽到密碼為string形式
    userAttendCodeInput = e.detail;
  },
  // 提交簽到密碼
  submitAttendCode(condition) {
    // 判斷與courseInfoInput密碼是否相同
    if (userAttendCodeInput == attendCode || condition=='noAttendCode') {
      Toast.loading({
        message: '瘋狂加載中...',
        forbidClick: true,
        zIndex  : 99999999999999
      })
      this.data.courseCloudData.followMember.forEach((item,index)=>{
        if(item.arkid==this.data.userCloudData.arkid){
          let myInfo = item;
          wx.cloud.callFunction({
            name : 'takeAttendance',
            data : {
              arkid     : this.data.userCloudData.arkid,
              courseId  : this.data.courseCloudData._id,
              myInfo    : myInfo,
            }
          }) .then(res=>{
            // 寫入本地資料，保證wxml更新 - 未完成
            myInfo.haveAttend = true;
            this.setData({
              ['courseCloudData.followMember'] : this.data.courseCloudData.followMember,
              haveAttend : true
            })
            Toast.success('簽到成功')
            console.log(res);
          }) .catch(err=>{
            Toast.fail('遇到錯誤')
            console.error(err);
          })
        }
      })
    }
    else{
      Toast.fail('密碼錯誤')
    }
  },

  // 下載文件
  downLoadFile(e) {
    let selectIndex = e.currentTarget.dataset.index;
    let size = this.data.courseCloudData.filePaths[selectIndex].size;
    let mes;
    // 計算文件大小
    if (size>1000) {
      size = size/1000000;
      mes = size.toFixed(2)+" MB";
      console.log(mes);
    } else {
      size = size/100;
      mes = size.toFixed(2)+" KB";
      console.log(mes);
    }
    Dialog.confirm({
      title: '操作提示',
      message: '確定獲取文件：\n "'+this.data.courseCloudData.filePaths[selectIndex].name+'"\n('+mes+')'+' 的下載鏈接嗎？',
    }) .then(res=>{
      let path = this.data.courseCloudData.filePaths[selectIndex].path;
      db.collection('fileList') .where({
        'fileInfo.path' : path,
      }) .field({  cloudFileId : true  }) .get() .then(res=>{
        // 獲取可下載的真實鏈接
        wx.cloud.getTempFileURL({
          fileList : [res.data[0].cloudFileId]      // 傳參為數組形式
        }) .then(res => {
          Toast.success('獲取成功！');
          // 寫入用戶粘貼板
          wx.setClipboardData({
            data: res.fileList[0].tempFileURL,    // 可下載的真實鏈接
            success (res) {
              Toast('已複製鏈接到粘貼板，\n可前往瀏覽器打開！');
            }
          })
        }).catch(error => {  console.error(error);  })
      })
    })
  },

  // 步驟條
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  // 下一步 - 按鈕觸發
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 1 : this.data.num + 1
    })
  },

  // 跳轉編輯頁
  editInfo() {
    let detailInfo = {
      user             :   "speaker",
      courseCloudData  :   this.data.courseCloudData,
    }
    detailInfo = JSON.stringify(detailInfo);
    wx.navigateTo({
      url: '../holdACourses/holdACourses?detailInfo=' + encodeURIComponent(detailInfo),
    })
  },

  // 跳轉 查看用戶信息頁，需填上arkid和url
  jumpToUserDetail(e) {
    let arkid = e.currentTarget.dataset.arkid;
    arkid = parseInt(arkid)
    let url = '../../user/userDetail/userDetail';
    app.appJumpToUserDetail(arkid,url);
  },

});