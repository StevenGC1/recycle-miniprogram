// pages/mine/mine.js —— V1.9
// ============================================================
// "我的"页面逻辑
// ------------------------------------------------------------
// V1.9 改动：
//   - 新增 onApplyMerchant：跳转去"申请入驻成为回收商"页面
//   - 新增 onForceApproveAndEnter：开发测试用，一键把审核状态强制改成
//     approved 并直接进商户工作台，免去你每次测试都要重新走申请流程
//   - 移除了原来简单的 onSwitchToMerchant（无审核校验直接切换），
//     符合"取消退出商户逻辑，应由审核状态自动判定"的设计方向
// ============================================================

const mock = require('../../utils/mock.js');
const config = require('../../config/config.js');

Page({
  data: {
    profile: {},
    isBound: true,
    showServiceModal: false,
    customerServiceWechat: config.CUSTOMER_SERVICE_WECHAT
  },

  onLoad() {
    this.setData({ profile: mock.getResidentProfile() });
  },

  onShow() {
    this.setData({ isBound: getApp().globalData.isBound });
  },

  onToggleBound(e) {
    const newValue = e.detail.value;
    getApp().globalData.isBound = newValue;
    this.setData({ isBound: newValue });
    wx.showToast({ title: newValue ? '已切换为：绑定商家' : '已切换为：未绑定商家', icon: 'none' });
  },

  onAddFamily() {
    wx.navigateTo({
      url: '/pages/familyBind/familyBind'
    });
  },

  onContactService() {
    this.setData({ showServiceModal: true });
  },

  onCloseServiceModal() {
    this.setData({ showServiceModal: false });
  },

  noop() {},

  onCopyWechat() {
    wx.setClipboardData({
      data: this.data.customerServiceWechat,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // V1.9 新增：跳转去"申请入驻成为回收商"页面
  onApplyMerchant() {
    wx.navigateTo({ url: '/pages/merchantApply/merchantApply' });
  },

  // V1.9 新增：[测试专用] 一键强制把审核状态改成 approved，并 reLaunch 进商户工作台
  // 真实上线后不会有这个按钮，正式的"身份判定与自动分流"逻辑写在 app.js 的 onLaunch 里
  onForceApproveAndEnter() {
    mock.submitMerchantApplication('张师傅废品回收站', '13800001234', '深圳市南山区');
    const application = mock.getMerchantApplication();
    application.status = 'approved'; // 测试场景直接跳过"人工审核"这一步
    wx.reLaunch({ url: '/pages/merchant/index/index' });
  }
});
