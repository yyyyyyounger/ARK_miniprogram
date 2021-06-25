var app =  getApp();  // 獲取全局數據

Page({
  data: {
    studentName_input :'',
    UM_ID_input :'',
    studentYear_input :'',
    studentMajor_input :'',

    studentYear: ["大一", "大二", "大三", "大四"],
    studentYearIndex: 0,
    studentMajor: ["ECE", "CPS", "xxx"],
    studentMajorIndex: 0,

    value:'',
    showClearBtn0:true,
    showClearBtn1:true,

  },
  onShow() {
    // 從全局數據中讀取
    this.setData({
      UM_ID_input : app.globalData.userInfoGlobal[0].input ,
      studentName_input : app.globalData.userInfoGlobal[1].input ,
      studentMajor_input : app.globalData.userInfoGlobal[2].input ,
      studentYear_input : app.globalData.userInfoGlobal[3].input ,
    })
    if ( this.data.studentYear_input == "未設置" ) {
      // 如果是未設置，應該為undefine，此時設置studentMajorIndex為0
      this.data.studentYearIndex = 0;
    }
    else{
      console.log("保存的Yearinput值的索引值：", this.data.studentYear.findIndex(o=> o== this.data.studentYear_input) );
      this.setData({
        studentYearIndex : this.data.studentYear.findIndex(o=> o==this.data.studentYear_input),
      })
    }
    if ( this.data.studentMajor_input == "未設置" ) {
      // 如果是未設置，應該為undefine，此時設置studentMajorIndex為0
      this.data.studentMajorIndex = 0;
    }
    else{
      console.log("保存的Majorinput值的索引值：", this.data.studentMajor.findIndex(o=> o== this.data.studentMajor_input) );
      this.setData({
        studentMajorIndex : this.data.studentMajor.findIndex(o=> o==this.data.studentMajor_input),
      })
    }
    console.log("onShow() - editPage加載完成");
  },
  formInputChange(e) {
    // 输入监听，該方法可以多個input綁定同一個函數
    let item = e.currentTarget.dataset.model;
    this.setData({
      [item]: e.detail.value
    });

    // Clear按鈕顯示邏輯
    this.setData({
        showClearBtn0 : !!this.data.UM_ID_input.length,
        showClearBtn1 : !!this.data.studentName_input.length,
      });
    console.log("UM_ID_input為 ",this.data.UM_ID_input.length);
    console.log("studentName_input為 ",this.data.studentName_input.length);
  },
  bindStudentMajorChange(e){
    console.log('picker studentMajor 发生选择改变，携带值为', e.detail.value);
    this.setData({ //存起picker改變的攜帶值
      studentMajorIndex: e.detail.value ,
    })
    this.setData({ //必須第二次SetData才會準確更新
      studentMajor_input : this.data.studentMajor[this.data.studentMajorIndex] ,
    })
    console.log("studentMajor_input-第二次setData為 ", this.data.studentMajor_input);
  },
  bindStudentYearChange(e) {
    console.log('picker studentYear 发生选择改变，携带值为', e.detail.value);
    this.setData({
      studentYearIndex: e.detail.value ,
    })
    this.data.studentYear_input = this.data.studentYear[this.data.studentYearIndex] ;
    console.log("studentYear_input ", this.data.studentYear_input);
  },
  onClear0() {
    // 清空學生號輸入
    this.setData({
      UM_ID_input :'',
      showClearBtn0: false,
    });
  },
  onClear1() {
    // 清空姓名輸入
    this.setData({
      studentName_input :'',
      showClearBtn1: false,
    });
  },
  submitForm() {
    // 設置picker的默認選項
    if (this.data.studentMajor_input == "未設置") {
      this.data.studentMajor_input = "ECE"
    }
    if (this.data.studentYear_input == "未設置") {
      this.data.studentYear_input = "大一"
    }
    // 如果輸入rules條件所有成立，
    // 則寫入變量
    app.globalData.userInfoGlobal[0].input = this.data.UM_ID_input;
    app.globalData.userInfoGlobal[1].input = this.data.studentName_input;
    app.globalData.userInfoGlobal[2].input = this.data.studentMajor_input;
    app.globalData.userInfoGlobal[3].input = this.data.studentYear_input;

    wx.showModal({    //彈窗確認
      title: '提示',
      content: '確定修改嗎',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx:wx.navigateBack({    // 返回上一級
            delta: 1
          });
          // 動態提示
          wx.showToast({
            title: '修改成功',
            // 持續時間
            duration: 700
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  submitForm_cancel() {
    wx.showModal({    //彈窗確認
      title: '提示',
      content: '確定直接退出嗎',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx:wx.navigateBack({
            delta: 1
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

});