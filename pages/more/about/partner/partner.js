Page({
  /**
   * 页面的初始数据
   */
  data: {
    institutionNum:2,
    institutionInfo:[{
      id:0,
      iconSrc:'https://i.loli.net/2021/08/24/mQj168BbwCuJOUN.jpg',
      name:'電腦學會',
      info:'&nbsp;&nbsp;澳門大學學生會電腦學會是以電腦為主題的學會，希望透過活動提升電腦系同學的歸屬感及團體精神。我們亦歡迎所有不同學系的同學，目的是透過舉辦工作坊、踏上IT第一步等等教授同學不同的電腦知識及認識電腦行業的前景。電競也是我們的主打之一，現時電競遊戲是一個十分熱門的話題，我們透過舉辦大大小小的比賽及交流活動等等，如最近所舉辦的澳大電競日從而推廣電競文化，讓不論是有接觸過電競與否的朋友也可以透過活動來認識電競及享受遊戲的樂趣。',
      bottomInfo:`聯絡電郵：umsu.cps@umac.mo
      Facebook專頁 : 澳門大學學生會電腦學會
      Instagram: cps.umsu`,
    },
    {
      id:1,
      iconSrc:'https://i.loli.net/2021/08/24/PIh8sfRW9yMn2CD.jpg',
      name:'IET澳門學生支部',
      info:'&nbsp;&nbsp;工程及科技學會是一個國際性的工程師學會，是一個能分享專業知識的專業平台以及向大家宣傳科學的正面訊息。工程及科技學會的總會設立於倫敦，在全球127個國家裏有超過150,000名會員。工程及科技學會分別在歐洲，北美對及香港等地方設立分會。工程及科技學會同時也能提供國際認可的專業證書。',
      bottomInfo:`聯絡電郵 : umsu.iet@umac.mo
      Facebook專頁: The IET Hong Kong Students Section Macau`,
    },]//如果需要修改学会信息，只需要修改数组和上方institutionNum为学会数量即可
  },
  onShow: function () {
    this.setData({
      institutionNum:this.data.institutionNum-1,
      page:0
    })
  },

  pageUp(){
    this.setData({
      page:this.data.page+1
    })
  },

  pageDown(){
    this.setData({
      page:this.data.page-1,
    })
  }
})