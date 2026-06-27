// pages/merchant/hall/hall.js
// ============================================================
// 商户端 - 接单大厅逻辑
// ------------------------------------------------------------
// 数据来源：mock.getHallOrderList()
// 注意：这个函数返回的数据本身就已经"脱敏"过了（没有手机号和详细地址），
// 对应方案里"隐藏手机号和详细门牌号，只显示小区名和时间"的设计。
//
// "抢单"动作原型阶段做的事情：
//   把这条订单从"大厅列表"里移除（模拟"被抢走了，别人看不到了"），
//   并提示"抢单成功"。真实后端需要做并发控制（防止多个商户同时抢到同一单），
//   原型阶段不用考虑这个问题。
// ============================================================

const mock = require('../../../utils/mock.js');
const config = require('../../../config/config.js');

Page({
  data: {
    radiusKm: config.MERCHANT_SERVICE_RADIUS_KM,
    hallOrders: []
  },

  onLoad() {
    this.loadHallOrders();
  },

  onShow() {
    this.loadHallOrders();
  },

  loadHallOrders() {
    // 真实接口： GET /api/merchant/hall/list?lat=xx&lng=xx&radius=3
    this.setData({ hallOrders: mock.getHallOrderList() });
  },

  onGrabOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '抢单确认',
      content: '确认抢这一单吗？抢单后将进入"我的任务"，可查看完整地址和电话。',
      success: (res) => {
        if (res.confirm) {
          // 原型阶段：仅在前端内存里把这条订单从大厅列表移除
          const newList = this.data.hallOrders.filter(o => o.orderId !== orderId);
          this.setData({ hallOrders: newList });
          wx.showToast({ title: '抢单成功！', icon: 'success' });
        }
      }
    });
  },

  goTasks() {
    wx.navigateTo({ url: '/pages/merchant/tasks/tasks' });
  },

  goPromotion() {
    wx.navigateTo({ url: '/pages/merchant/promotion/promotion' });
  },

  // 退出商户端，回到居民身份
  goBackResident() {
    const app = getApp();
    app.globalData.role = 'resident';
    wx.switchTab({ url: '/pages/index/index' });
  }
});
