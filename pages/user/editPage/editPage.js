var app =  getApp();  // 獲取全局數據
var UM_ID_input;
var studentYear_input;
var studentMajor_input;
var studentName_input;

Page({    
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/weui/example/form/form'
    }
  },
  data: {
    userInfoGlobal : {},

    showTopTips: false,

    radioItems: [
        {name: 'cell standard', value: '0', checked: true},
        {name: 'cell standard', value: '1'}
    ],
    checkboxItems: [
        {name: 'standard is dealt for u.', value: '0', checked: true},
        {name: 'standard is dealicient for u.', value: '1'}
    ],
    items: [
        {name: 'USA', value: '美国'},
        {name: 'CHN', value: '中国', checked: 'true'},
        {name: 'BRA', value: '巴西'},
        {name: 'JPN', value: '日本'},
        {name: 'ENG', value: '英国'},
        {name: 'TUR', value: '法国'},
    ],

    date: "2016-09-01",
    time: "12:01",

    studentYear: ["大一", "大二", "大三", "大四"],
    studentYearIndex: 0,

    studentMajor: ["ECE", "CPS", "xxx"],
    studentMajorIndex: 0,

    // accounts: ["微信号", "QQ", "Email"],
    // accountIndex: 0,

    isAgree: false,
    // 表單數據
    formData: {
      
    },
    rules: [{
        name: 'radio',
        rules: {required: false, message: '单选列表是必选项'},
    }, {
        name: 'checkbox',
        rules: {required: true, message: '多选列表是必选项'},
    }, {
        name: 'name',
        rules: {required: true, message: '请输入姓名'},
    }, {
        name: 'qq',
        rules: {required: true, message: 'qq必填'},
    }, {
        name: 'mobile',
        rules: [{required: true, message: 'mobile必填'}, {mobile: true, message: 'mobile格式不对'}],
    }, {
        name: 'vcode',
        rules: {required: true, message: '验证码必填'},
    }, {
        name: 'idcard',
        rules: {validator: function(rule, value, param, modeels) {
            if (!value || value.length !== 18) {
                return 'idcard格式不正确'
            }
        }},
    }]
  },
  onload() {
    this.setData({
      userInfoGlobal : app.globalData.userInfoGlobal
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
        radioItems: radioItems,
        [`formData.radio`]: e.detail.value
    });
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false;

        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
            if(checkboxItems[i].value == values[j]){
                checkboxItems[i].checked = true;
                break;
            }
        }
    }

    this.setData({
        checkboxItems: checkboxItems,
        [`formData.checkbox`]: e.detail.value
    });
  },
  bindDateChange: function (e) {
    this.setData({
        date: e.detail.value,
        [`formData.date`]: e.detail.value
    })
  },
  formInputChange(e) {
    console.log("事件值：",e);
    const {field} = e.currentTarget.dataset;
    this.setData({
        [`formData.${field}`]: e.detail.value ,
    })
    UM_ID_input = e.detail.value;
    console.log("全局變量值：",UM_ID_input);
  },
  formNameInputChange(e) {
    console.log("事件值：",e);
    const {field} = e.currentTarget.dataset;
    studentName_input = e.detail.value;
    console.log("全局變量值：",studentName_input);
  },
  bindTimeChange: function (e) {
    this.setData({
        time: e.detail.value
    })
  },
  bindStudentMajorChange: function(e){
    console.log('picker studentMajor 发生选择改变，携带值为', e.detail.value);

    this.setData({
      studentMajorIndex: e.detail.value
    })
    studentMajor_input = this.data.studentMajor[e.detail.value];
  },
  bindStudentYearChange: function(e) {
    console.log('picker studentYear 发生选择改变，携带值为', e.detail.value);

    this.setData({
      studentYearIndex: e.detail.value
    })
    studentYear_input = this.data.studentYear[e.detail.value];
  },
  bindAccountChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
        accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
        isAgree: !!e.detail.value.length
    });
  },
  submitForm() {
    // this.selectComponent('#form').validate((valid, errors) => {
    //   console.log('valid', valid, errors)
    //   if (!valid) {
    //     const firstError = Object.keys(errors)
    //     if (firstError.length) {
    //         this.setData({
    //             error: errors[firstError[0]].message
    //         })

    //     }
    //   } 
    //   else {
    //     wx.showToast({
    //         title: '校验通过'
    //     })
    //   }
    // })

    // 這裡缺少條件判斷

    // 如果條件所有成立，
    // 寫入變量
    console.log("app.js變量值：",app.globalData.userInfoGlobal[3].input);
    if (!studentYear_input | !studentMajor_input) {
      studentYear_input = this.data.studentYear[0]
      studentMajor_input = this.data.studentMajor[0]
      if (!UM_ID_input) {
        UM_ID_input = "未設置"
      }
    }
    app.globalData.userInfoGlobal[0].input = UM_ID_input;
    app.globalData.userInfoGlobal[1].input = studentName_input;
    app.globalData.userInfoGlobal[2].input = studentYear_input;
    app.globalData.userInfoGlobal[3].input = studentMajor_input;
    // 返回上一級
    wx:wx.navigateBack({
      delta: 1
    });
  },
  submitForm_cancel() {
    wx:wx.navigateBack({
      delta: 1
    });
  }

});