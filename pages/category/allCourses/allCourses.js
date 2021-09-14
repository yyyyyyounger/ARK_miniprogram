import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const db = wx.cloud.database();
const _ = db.command

Page({
    data: {
        items: [{
            // 导航名称
            text: 'All Major',
            //是否显示小红点
            dot: false,
            // 禁用选项
            disabled: false,
            // 该导航下所有的可选项
            children: [{
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
        }, ],
        mainActiveIndex: 0,
        activeId: [1, 2, 3, 4],
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
        }
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
                Toast.success('加載成功！')
            }).catch(err => {
                console.error(err);
            });
    },

    onShow: function() {

    },

    onHide: function() {

    },

    onPullDownRefresh: function() {
        this.app.onPullDownRefresh(this)
    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

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
        for (let i in activeId) {
            check[i] = this.data.items[0].children[activeId[i] - 1].text;
        }
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
    onSearch() {
        Toast("search");
    },
})