// pages/merchant/mine/mine.js —— V1.9
// ============================================================
// 商户端 - 商户中心逻辑
// ============================================================

const mock = require('../../../utils/mock.js');

Page({
  data: {
    dashboard: {},
    merchantProfile: {},
    showPromoModal: false
  },

  onShow() {
    this.setData({
      dashboard: mock.getMerchantDashboard(),
      merchantProfile: mock.getMerchantProfile()
    });
  },

  onShowPromoCode() {
    this.setData({ showPromoModal: true });
  },

  onClosePromoModal() {
    this.setData({ showPromoModal: false });
  },

  noop() {},

  onGoPriceConfig() {
    wx.navigateTo({ url: '/pages/merchant/priceConfig/priceConfig' });
  },

  onBackToIndex() {
    wx.navigateBack();
  },

  // [测试专用] 把审核状态改回 pending，并 reLaunch 回用户端首页
  // 真实上线后不会有这个按钮，这里只是方便你开发时来回切换两端测试
  onExitMerchantForTest() {
    const application = mock.getMerchantApplication();
    application.status = 'pending';
    wx.reLaunch({ url: '/pages/index/index' });
  }
});
