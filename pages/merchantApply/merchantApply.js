// pages/merchantApply/merchantApply.js
// ============================================================
// 商户入驻申请页面逻辑
// ------------------------------------------------------------
// 对应 PRD"商户怎么注册"：
//   提交申请 -> mock.submitMerchantApplication() 把状态改成 pending
//   你（管理员）在真实项目里会去后台手动把 pending 改成 approved
//   原型阶段没有真实管理后台，所以在"我的"页面放了一个【测试开关】，
//   可以直接把状态强制改成 approved，模拟"审核通过"的效果
// ============================================================

const mock = require('../../utils/mock.js');

Page({
  data: {
    applicationStatus: 'none',
    application: {},
    shopName: '',
    phone: '',
    serviceArea: ''
  },

  onShow() {
    const application = mock.getMerchantApplication();
    this.setData({
      applicationStatus: application.status,
      application
    });
  },

  onShopNameInput(e) {
    this.setData({ shopName: e.detail.value });
  },
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },
  onServiceAreaInput(e) {
    this.setData({ serviceArea: e.detail.value });
  },

  onSubmitApply() {
    if (!this.data.shopName || !this.data.phone || !this.data.serviceArea) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    mock.submitMerchantApplication(this.data.shopName, this.data.phone, this.data.serviceArea);
    wx.showToast({ title: '提交成功，等待审核', icon: 'success' });

    const application = mock.getMerchantApplication();
    this.setData({ applicationStatus: application.status, application });
  },

  onGoMerchantIndex() {
    wx.reLaunch({ url: '/pages/merchant/index/index' });
  }
});
