Component({
  data: {
    active: '',
    list: [
      {
        icon: 'wap-home',
        text: '首頁',
        url: '/pages/index/index'
      },
      {
        icon: 'label',
        text: '課程',
        url: '/pages/category/category'
      },
      {
        icon: 'manager',
        text: '我的',
        url: '/pages/user/user'
      },
      {
        icon: 'setting',
        text: '更多',
        url: '/pages/more/more'
      }
    ]
  },

  methods: {
    onChange(event) {
      let index = event.detail;
      wx.switchTab({
          url: this.data.list[index].url
      });
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
          active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
})