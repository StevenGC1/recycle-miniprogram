// pages/orderList/orderList.js
// ============================================================
// 用户端订单列表页逻辑
// ------------------------------------------------------------
// 数据来源：utils/mock.js 里写死的 3 条假订单（一条待接单/一条待上门/一条已完成）
// 核心逻辑：
//   1. 根据顶部 tab 选择的状态，对全量订单做前端筛选（filteredOrders）
//   2. "取消订单"只是从内存里的列表中移除，刷新页面是 demo（不会真的请求后端）
// ============================================================

const mock = require('../../utils/mock.js');

// 状态 -> 展示文案 / 样式类 的映射表，避免 wxml 里写一堆 if-else
const STATUS_MAP = {
  wait: { text: '待接单', tagClass: 'tag-wait' },
  accepted: { text: '待上门', tagClass: 'tag-accepted' },
  done: { text: '已完成', tagClass: 'tag-done' }
};

Page({
  data: {
    tabs: [
      { label: '全部', value: 'all' },
      { label: '待接单', value: 'wait' },
      { label: '待上门', value: 'accepted' },
      { label: '已完成', value: 'done' }
    ],
    currentTab: 'all',
    allOrders: [],      // 原始全量订单（带展示文案处理后的版本）
    filteredOrders: []  // 根据 currentTab 筛选后的、真正渲染到页面的数据
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    // 每次页面显示时重新加载一次（比如从首页下单跳转回来时）
    this.loadOrders();
  },

  // 加载订单数据：从 mock 里取出原始数据，并补充上展示用的文案/样式字段
  loadOrders() {
    const rawList = mock.getOrderList();
    const processedList = rawList.map(order => {
      const statusInfo = STATUS_MAP[order.status] || { text: '未知状态', tagClass: '' };
      return Object.assign({}, order, {
        statusText: statusInfo.text,
        statusTagClass: statusInfo.tagClass
      });
    });

    this.setData({ allOrders: processedList }, () => {
      this.applyFilter();
    });
  },

  // 根据当前选中的 tab 筛选订单
  applyFilter() {
    const { allOrders, currentTab } = this.data;
    const filtered = currentTab === 'all'
      ? allOrders
      : allOrders.filter(o => o.status === currentTab);
    this.setData({ filteredOrders: filtered });
  },

  onSwitchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.value }, () => {
      this.applyFilter();
    });
  },

  // 取消订单：原型阶段只在前端内存中移除，不调用后端接口
  onCancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          const newAllOrders = this.data.allOrders.filter(o => o.orderId !== orderId);
          this.setData({ allOrders: newAllOrders }, () => {
            this.applyFilter();
            wx.showToast({ title: '已取消（仅前端演示）', icon: 'none' });
          });
        }
      }
    });
  }
});
