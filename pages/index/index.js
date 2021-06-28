var app = getApp(); 

Page({
  data: {
    isShow : false,
    projStartTime: [],
    today:'',
    durationDay:0,
  
  },
  onLoad: function() {
    this.app = getApp();

    this.setData({
      projStartTime : app.globalData.projStartTime[0]
    });
    console.log("項目開始時間："+this.data.projStartTime.Year +'/'+ this.data.projStartTime.Month +'/'+ this.data.projStartTime.Day);
    // 計算已過日期
    this.app.calcDurationDay(this,1,'2021/06/03');
    this.onShow();
    console.log("onLoad() - index加載完成");
  },
  onShow (){  //頁面展示時，觸發動畫
  // this.app.slideupshow(this, 'slide_up1', -200, 1);
  //第一个参数是当前的页面对象，方便函数setData直接返回数据
  //第二个参数是绑定的数据名,传参给setData,供wxml綁定
  //第三个参数是上下滑动的px,因为class="init"定义初始该元素向下偏移了200px，所以这里使其上移200px
  //第四个参数是需要修改为的透明度，这里是1，表示从初始的class="init"中定义的透明度0修改到1
    this.app.slideupshow(this, 'slide_up1', -200, 1)
    // 延時後生成第二個可供綁定數據名
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 300);
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up3', -200, 1)
    }.bind(this), 600);
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up4', -200, 1)
    }.bind(this), 900);
  },
  onHide (){  //頁面隱藏時，觸發漸出動畫
    //你可以看到，动画参数的200,0与渐入时的-200,1刚好是相反的，其实也就做到了页面还原的作用，使页面重新打开时重新展示动画
    this.app.slideupshow(this, 'slide_up1', 200, 0)
    //延时展现容器2，做到瀑布流的效果
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 200, 0)
    }.bind(this), 300);
    //延时展现容器3，做到瀑布流的效果
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up3', 200, 0)
    }.bind(this), 600);
    //延时展现容器4，做到瀑布流的效果
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up4', 200, 0)
    }.bind(this), 900);

    console.log("onHide() - index觸發");
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  // 跳轉“協議”頁
  handleTapProtocol () {
    console.log("跳轉ARK協議頁");
    wx:wx.navigateTo({
      url: '../protocol/protocol'
    });
  },
  // 跳轉“關於”頁
  jumpToAbout () {
    wx.navigateTo({
      url: '../more/about/about',
    });
  },
  // 跳轉“公告”頁
  jumpToNotice () {
    wx.navigateTo({
      url: '../notice/notice',
    });
  },
  jumpToCourse_tabBar () {
    wx.switchTab({
      url: '../category/category'
    });
  },
  
}); 
  