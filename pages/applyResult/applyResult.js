// pages/applyResult/applyResult.js
const mock = require('../../utils/mock.js');

Page({
  data: {
    status: 'pending',
    application: {}
  },

  onShow() {
    const application = mock.getMerchantApplication();
    this.setData({ status: application.status, application });
  },

  onGoMerchantIndex() {
    wx.reLaunch({ url: '/pages/merchant/index/index' });
  },

  onReapply() {
    // 重新申请：把状态打回 none，再 redirectTo 表单页（避免回退栈又跳回结果页死循环）
    const application = mock.getMerchantApplication();
    application.status = 'none';
    wx.redirectTo({ url: '/pages/merchantApply/merchantApply' });
  }
});
