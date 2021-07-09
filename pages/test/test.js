//获取应用实例
// const app = getApp();
var cloudData = require('../../data/cloud');
var towxml = require('../../towxml/index');

Page({
    data: {
        isLoading: true,                    // 判断是否尚在加载中
        article: {}                     // 内容数据
    },
    onLoad: function () {
      this.setData({  ARK: cloudData.ARK  });

      // let result = app.towxml(`# Markdown`,'markdown',{
      //     base:'https://xxx.com',             // 相对资源的base路径
      //     theme:'dark',                   // 主题，默认`light`
      //     events:{                    // 为元素绑定的事件方法
      //         tap:(e)=>{
      //             console.log('tap',e);
      //         }
      //     }
      // });

      // let result = towxml(`# Markdown渲染`,'markdown',);
      let result = towxml(this.data.ARK,'markdown',);

      // 更新解析数据
      this.setData({
          article:result,
          isLoading: false,
      });

      // console.log(cloudData.ARK);
    }
})