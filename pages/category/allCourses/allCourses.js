import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
let cloudData = require('../../../data/cloud.js')

const db = wx.cloud.database();
const _ = db.command

Page({
    data: {
        items: [{
            // 导航名称
            text: 'FST',
            //是否显示小红点
            dot: false,
            // 禁用选项
            disabled: false,
            // 该导航下所有的可选项
            children: cloudData.majorTagArray.map((e,index)=>{
                return {
                    id : index,
                    text : e,
                }
            })
            // [
            //     {
            //         // 名称
            //         text: 'ECE',
            //         // id，作为匹配选中状态的标识
            //         id: 1,
            //     },
            //     {
            //         text: 'CIS',
            //         id: 2,
            //     },
            //     {
            //         text: 'NKU',
            //         id: 4,
            //     },
            // ],
        }, ],
        mainActiveIndex: 0,
        // 篩選item的激活狀態，默認全選             [1, 2,] 意為激活第1,2的索引
        activeId: [],
        // activeId: cloudData.majorTagArray.map((e,index)=>{
        //     return index
        // }) ,
        // max: 4,      // 允許的最大選擇個數

        show: false,
        option1: [
            { text: '课程ID', value: 0 },
            { text: '专业标签', value: 1 },
            { text: '课程名', value: 2 },
            { text: '讲师名', value: 3 },
            { text: '时间', value: 4 },
        ],
        value1: 0,
        allCourse: [],

        up_or_down: "down", //預設升序符號
        asc_or_desc: "asc", //預設升序
        order_by: "_id", //預設以課程id排序
        fields: {
            "_id":"课程ID",
            "majorTag": "专业标签",
            "courseName": "课程名",
            "speakerName": "讲师名",
            "time": "时间"
        },
        allCourseObj : []
    },

    onLoad: function(options) {
        this.app = getApp();
        var checkmap = [];
        // js獨有promise語法
        db.collection('course').where({
                //id 0 不顯示
                _id: _.gt(0),
                courseState: _.eq('opening').or(_.eq('finish'))
            }).orderBy('_id', 'asc').get() // 默認以課程id升序排序
            .then(res => { // 查詢成功，寫入allCourse準備wxml渲染
                this.setData({ allCourse: res.data })
                console.log('onLoad');
                this.createAllCourseObj(this.data.allCourse);
                Toast.success('加載成功！')
            }).catch(err => {
                console.error(err);
            });
    },

    onPullDownRefresh: function() {
        this.app.onPullDownRefresh(this)
    },

    //變更下拉選單時
    change_menu_item: function(e) {
        var fieldnames = ["_id", "majorTag", "courseName", "speakerName", "time"];
        this.setData({
            order_by: fieldnames[e.detail],
        });
        //進行排序
        this.sort_table(this.data.order_by, this.data.asc_or_desc);
        Toast(this.data.fields[this.data.order_by] + (this.data.asc_or_desc == 'asc' ? '升序' : '降序'));
    },

    //變更升降序符號時
    change_sort_order: function(e) {        
        if (this.data.up_or_down == 'up') {
            //如是升，改成降
            this.setData({
                up_or_down: 'down',
                asc_or_desc: 'asc'
            })
        } else {
            //如是降，改成升
            this.setData({
                up_or_down: 'up',
                asc_or_desc: 'desc'
            })
        }
        Toast(this.data.fields[this.data.order_by] + (this.data.asc_or_desc == 'asc' ? '升序' : '降序'));
        //進行排序
        this.sort_table(this.data.order_by, this.data.asc_or_desc);
    },

    //跟據下拉選單已選項目(order_by)及升降序符號(asc_or_desc)進行排序
    sort_table: function(order_by, asc_or_desc) {
        if (asc_or_desc == 'asc') {
            //使用compare function順序排序
            this.setData({
                allCourse: this.data.allCourse.sort(this.compare(order_by))
            })
        } else if (asc_or_desc == 'desc') {
            //使用compare function後用.reverse()倒序排序
            this.setData({
                allCourse: this.data.allCourse.sort(this.compare(order_by)).reverse()
            })
        }
        this.createAllCourseObj(this.data.allCourse);
    },

    //用作allCourse.sort()中的順序排序function
    compare: function(order_by) {
        return function(a, b) {
            //跟據下拉選單已選項目排序
            switch (order_by) {
                case '_id':
                    var x = a._id;
                    var y = b._id;
                    break;
                case 'majorTag':
                    var x = a.courseInfoInput[3].input[0];
                    var y = b.courseInfoInput[3].input[0];
                    break;
                case 'courseName':
                    var x = a.courseInfoInput[1].input;
                    var y = b.courseInfoInput[1].input;
                    break;
                case 'speakerName':
                    var x = a.courseInfoInput[6].input;
                    var y = b.courseInfoInput[6].input;
                    break;
                case 'time':
                    var x = a.timeStampPick;
                    var y = b.timeStampPick;
            }
            let reg = /[a-zA-Z0-9]/
                //如果不是中文
            if (reg.test(x) || reg.test(y)) {
                if (x > y) {
                    return 1
                } else if (x < y) {
                    return -1
                } else {
                    return 0
                }
            } else {
                //如果是中文使用localeCompare()
                return x.localeCompare(y)
            }
        }
    },

    onClickShow() {
        this.setData({ show: true });
    },

    onClickHide() {
        this.setData({ show: false });
    },

    onClickNav({ detail = {} }) {
        this.setData({
            mainActiveIndex: detail.index || 0,
        });
    },

    onClickItem({ detail = {} }) {
        console.log(detail);
        const { activeId } = this.data;

        if (activeId[0]) {
            const index = activeId.indexOf(detail.id);
            if (index > -1) {
                activeId.splice(index, 1);
            } else {
                activeId.push(detail.id);
            }
        } else {
            activeId.push(detail.id);
        }

        console.log(activeId);
        this.setData({ activeId });

        let check = [];
        check = this.data.items[0].children.map((e)=>{
            if (activeId.indexOf(e.id)>-1) {
                return e.text
            }
        })
        // 去除數組內undefined的值
        check = check.filter(Boolean);
        
        console.log("check變量為",check);

        db.collection('course').where({
            'courseInfoInput.3.input.0': _.in(check)
        }).get()
        .then(res=>{
            console.log('獲取成功');
            this.createAllCourseObj(res.data)
        }) .catch(err=>{
            console.error(err);
        })
    },

    jumpToCourseDetail(e){
        let selectId = e.currentTarget.dataset.courseid;
        // 跳轉課程詳情頁
        let detailInfo = {
            user      : "normal",
            courseId  : selectId,
        }
        detailInfo = JSON.stringify(detailInfo);
        console.log(detailInfo);
        wx.navigateTo({
            url: '../courseDetail/courseDetail?detailInfo=' + detailInfo,
        })
    },

    createAllCourseObj: function (allCourse){
        let tmp2 = [];
        allCourse.forEach(function(x){
            let tmp = {};
            tmp.id = x._id;
            tmp.majorTag = x.courseInfoInput[3].input[0];
            tmp.courseName = x.courseInfoInput[1].input;
            tmp.lecturer = x.courseInfoInput[6].input;
            tmp.time = x.courseInfoInput[5].input[0];
            tmp2.push(tmp);
        })
        this.setData({
            allCourseObj: tmp2
        })
        console.log(tmp2);
        return tmp2;
    },

    onSearch: function(e){
        let original = this.createAllCourseObj(this.data.allCourse);
        let searchStr = e.detail.toLowerCase();
        let matchedIndex = [];
        original.forEach(function(x, i){
            if(x.majorTag.toLowerCase().indexOf(searchStr)!=-1){
                matchedIndex.push(i);
            }
            if(x.courseName.toLowerCase().indexOf(searchStr)!=-1){
                matchedIndex.push(i);
            }
            if(x.lecturer.toLowerCase().indexOf(searchStr)!=-1){
                matchedIndex.push(i);
            }
        })
        matchedIndex = Array.from(new Set(matchedIndex));
        console.log(matchedIndex);
        let tmp = [];
        for(let i=0; i<matchedIndex.length; i++){
            tmp.push(this.data.allCourseObj[matchedIndex[i]]);
        }
        this.setData({
            allCourseObj: tmp
        })
    },

    onCancel: function(){
        this.createAllCourseObj(this.data.allCourse);
    }
})