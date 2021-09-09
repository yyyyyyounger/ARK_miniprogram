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
      let app = getApp();
      let index = event.detail;
      const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
      if (userCloudDataStorage && index==1) {   // 如果點擊了課程頁，觸發獲取訂閱權限邏輯
        const subscribeState = wx.getStorageSync('subscribeState');
        if (!!subscribeState && subscribeState.allowSubscribe) {
          app.showSubscribe();
        }
      }
      wx.switchTab({
        url: this.data.list[index].url
      })
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      })
    }
  }
})