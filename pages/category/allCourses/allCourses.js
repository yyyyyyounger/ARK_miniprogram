import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const db = wx.cloud.database();
const _ = db.command

Page({
  data: {
    items:[
      {
        // 导航名称
        text: 'All Major',
        //是否显示小红点
        dot: false,
        // 禁用选项
        disabled: false,
        // 该导航下所有的可选项
        children: [
          {
            // 名称
            text: 'ECE',
            // id，作为匹配选中状态的标识
            id: 1,
          },
          {
            text: 'CIS',
            id: 2,
          },
          {
            text: 'FBA',
            id: 3,
          },
          {
            text: 'NKU',
            id: 4,
          },
        ],
      },
    ],
    mainActiveIndex: 0,
    activeId: [1,2,3,4],
    max: 4,

    show: false,
    option1: [
      { text: '课程ID', value: 0 },
      { text: '专业标签', value: 1 },
      { text: '课程名', value: 2 },
      { text: '讲师名', value: 3 },
      { text: '时间', value: 4 },

    ],
    value1: 0,
    allCourse:[]
  },
  onLoad: function (options) {
    this.app = getApp();
    var checkmap = [];
    db.collection('course').where({
      _id : _.gt (0),
      courseState : _.eq('opening').or(_.eq('finish'))
    }) .orderBy('_id', 'asc') .get()  // 默認以課程id升序排序
    .then(res=>{                      // 查詢成功，寫入allCourse準備wxml渲染
      this.setData({  allCourse: res.data  })
      Toast.success('加載成功！')
    })
  },

  onShow: function () {

  },

  onHide: function () {

  },

  onPullDownRefresh: function () {
    this.app.onPullDownRefresh(this)
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  mySort: function (e) {
    //property 根据什么排序
    var property = ["_id","majorTag","courseName","speakerName","time"];
    var self = this;
    var arr = self.data.allCourse;
    if (e.detail == 0) {
      db.collection('course').where({
        _id : _.gt (0)
      }).get({
        //如果查询成功的话    
        success: res => {
          this.setData({
            allCourse: res.data
          })
        }
      })
    }
    else{
      self.setData({
        allCourse: arr.sort(self.compare(property[e.detail]))
      })
    }
  },
  compare: function (property) {
    return function (a, b) {
      if (property != "time"){
      if (property == "courseName"){
        var x = a.courseInfoInput[1].input.charAt(0);
        var y = b.courseInfoInput[1].input.charAt(0);
      }
      else if (property == "name"){
        var x = a.courseInfoInput[6].input.charAt(0);
        var y = b.courseInfoInput[6].input.charAt(0);
      }
      else if (property == "majorTag"){
        var x = a.courseInfoInput[3].input[0];
        var y = b.courseInfoInput[3].input[0];
      }
        let reg = /[a-zA-Z0-9]/
        if(reg.test(x)|| reg.test(y)){
          if(x>y){
              return 1
          }else if(x<y){
              return -1
          }else{
              return 0
          }
        }else{
          return x.localeCompare(y)
        }}
      else{
        let val1 = a.timeStampPick;
        let val2 = b.timeStampPick;
        if (val1 > val2) return 1;
        else if (val1 == val2) return 0;
        else return -1;
      }
    }
  },

  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },

  noop() {
    
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const { activeId } = this.data;

    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }

    this.setData({ activeId });
    var check = [];
    for (let i in activeId){
      check[i] = this.data.items[0].children[activeId[i]-1].text;}
    console.log(check);
    db.collection('course').where({
      'courseInfoInput.3.input.0': _.or(check)
    }).get({
      //如果查询成功的话    
      success: res => {
        this.setData({
          allCourse: res.data
        })
      }
    })
       
    
  },

})