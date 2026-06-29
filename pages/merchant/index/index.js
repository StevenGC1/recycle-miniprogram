// pages/merchant/index/index.js —— V1.9
// ============================================================
// 商户端 - 工作台逻辑
// ------------------------------------------------------------
// 合并了原"接单大厅"和"我的任务"两个页面的逻辑：
//   - loadHallOrders()：加载公共订单池
//   - loadTaskList()：根据 currentSubTab（待上门/已完成/已取消）加载任务列表
//   - 已完成订单会回显用户评价（is_commented/rating/commentTags），
//     对应 PRD"放弃评价独立Tab，在已完成卡片内直接回显"的设计
// ============================================================

const mock = require('../../../utils/mock.js');
const config = require('../../../config/config.js');

const STATUS_MAP = {
  accepted: { text: '待上门', tagClass: 'tag-accepted' },
  done: { text: '已完成', tagClass: 'tag-done' },
  cancelled: { text: '已取消', tagClass: 'tag-wait' }
};

Page({
  data: {
    radiusKm: config.MERCHANT_SERVICE_RADIUS_KM,
    hallOrders: [],

    subTabs: [
      { label: '待上门', value: 'accepted' },
      { label: '已完成', value: 'done' },
      { label: '已取消', value: 'cancelled' }
    ],
    currentSubTab: 'accepted',
    taskList: [],

    showSettleModal: false,
    settleWeight: '',
    currentSettleOrderId: ''
  },

  onShow() {
    this.loadHallOrders();
    this.loadTaskList();
  },

  loadHallOrders() {
    this.setData({ hallOrders: mock.getHallOrderList() });
  },

  loadTaskList() {
    const app = getApp();
    const merchantId = app.globalData.mockUser.merchantId;
    const rawList = mock.getMerchantTaskList(merchantId, this.data.currentSubTab);

    const processedList = rawList.map(order => {
      const statusInfo = STATUS_MAP[order.status] || { text: '', tagClass: '' };
      // 把评分数字转成"★★★★★"这种星星字符串，方便 wxml 直接展示
      const ratingStars = order.rating ? '★'.repeat(order.rating) + '☆'.repeat(5 - order.rating) : '';
      const commentTagsText = order.commentTags ? order.commentTags.join('、') : '';
      return Object.assign({}, order, {
        statusText: statusInfo.text,
        statusTagClass: statusInfo.tagClass,
        ratingStars,
        commentTagsText
      });
    });

    this.setData({ taskList: processedList });
  },

  onSwitchSubTab(e) {
    this.setData({ currentSubTab: e.currentTarget.dataset.value }, () => {
      this.loadTaskList();
    });
  },

  onGrabOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '抢单确认',
      content: '确认抢这一单吗？抢单后将进入"待上门"任务，可查看完整地址和电话。',
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.hallOrders.filter(o => o.orderId !== orderId);
          this.setData({ hallOrders: newList });
          wx.showToast({ title: '抢单成功！', icon: 'success' });
          // 真实场景这里要刷新任务列表，但因为我们的mock是直接filter原数组、
          // 没有真的把这条订单的merchantId改成自己，原型阶段仅做提示
        }
      }
    });
  },

  onCallResident(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        wx.showModal({ title: '拨打电话', content: '模拟器无法真实拨号，真机会拨打：' + phone, showCancel: false });
      }
    });
  },

  onNavigate(e) {
    const address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: 39.9087,
      longitude: 116.3975,
      name: address,
      scale: 18,
      fail: () => {
        wx.showToast({ title: '导航功能需要真机或完整定位权限', icon: 'none' });
      }
    });
  },

  onConfirmDone(e) {
    this.setData({
      showSettleModal: true,
      settleWeight: '',
      currentSettleOrderId: e.currentTarget.dataset.id
    });
  },

  onSettleWeightInput(e) {
    this.setData({ settleWeight: e.detail.value });
  },

  onCloseModal() {
    this.setData({ showSettleModal: false });
  },

  noop() {},

  onSubmitSettle() {
    const weight = Number(this.data.settleWeight);
    if (!weight || weight <= 0) {
      wx.showToast({ title: '请输入有效重量', icon: 'none' });
      return;
    }

    mock.settleOrder(this.data.currentSettleOrderId, weight);
    this.setData({ showSettleModal: false });
    wx.showToast({ title: '已完成，积分已发放', icon: 'success' });

    // 结算完成后，刷新一下"待上门"列表（这条订单已经从这个tab消失了）
    this.loadTaskList();
  },

  goShop() {
    wx.navigateTo({ url: '/pages/merchant/shop/shop' });
  },

  goMine() {
    wx.navigateTo({ url: '/pages/merchant/mine/mine' });
  }
});
