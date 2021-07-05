Page({
  data: {
    active: 0,
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    console.log(event.detail);
    this.setData({ active: event.detail });
  },
});