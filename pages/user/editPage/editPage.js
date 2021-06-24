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
    showClearBtn:true,

  },
  onShow : function () {
    // 從全局數據中讀取
    this.setData({
      UM_ID_input : app.globalData.userInfoGlobal[0].input ,
      studentName_input : app.globalData.userInfoGlobal[1].input ,
      studentYear_input : app.globalData.userInfoGlobal[2].input ,
      studentMajor_input : app.globalData.userInfoGlobal[3].input ,
    })
    // console.log("studentYear_input為 ",this.data.studentYear_input);
    // console.log("查找值為 ", ((this.data.studentYear.find(o=> o==this.data.studentYear_input))) );
    // console.log("是否undefined複雜 ", (typeof(this.data.studentYear.find(o=> o==this.data.studentYear_input)) == "undefined") );
    if ( typeof(this.data.studentYear.find(o=> o==this.data.studentYear_input)) == "undefined" ) {
      // 如果是未設置，應該為undefine，此時設置studentYearIndex為0
      this.data.studentYearIndex = 0;
    }
    else{
      this.data.studentYearIndex = this.data.studentYear.findIndex(o=> o==this.data.studentYear_input);
    }
    if ( typeof(this.data.studentMajor.find(o=> o==this.data.studentMajor_input)) == "undefined" ) {
      // 如果是未設置，應該為undefine，此時設置studentMajorIndex為0
      this.data.studentMajorIndex = 0;
    }
    else{
      this.data.studentMajorIndex = this.data.studentMajor.findIndex(o=> o==this.data.studentMajor_input);
    }
    console.log("onShow() - editPage加載完成");
  },
  formInputChange(e) {
    // 输入监听
    let item = e.currentTarget.dataset.model;
    this.setData({
      [item]: e.detail.value
    });

    // Clear按鈕顯示邏輯
    const { value } = e.detail;
    this.setData({
        value,
        showClearBtn: !!value.length,
    });

    // console.log("UM_ID_input為 ",this.data.UM_ID_input);
    // console.log("studentName_input為 ",this.data.studentName_input);
  },
  bindStudentMajorChange(e){
    console.log('picker studentMajor 发生选择改变，携带值为', e.detail.value);
    this.setData({
      studentMajorIndex: e.detail.value ,
    })
    this.data.studentMajor_input = this.data.studentMajor[this.data.studentMajorIndex] ;
  },
  bindStudentYearChange(e) {
    console.log('picker studentYear 发生选择改变，携带值为', e.detail.value);
    this.setData({
      studentYearIndex: e.detail.value ,
    })
    this.data.studentYear_input = this.data.studentYear[this.data.studentYearIndex] ;
  },
  onClear() {
    // 清空輸入
    this.setData({
      value: '',
      UM_ID_input :'',
      showClearBtn: false,
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