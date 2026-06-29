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
    customerServiceWechat: config.CUSTOMER_SERVICE_WECHAT,
    showComplaintModal: false,
    complaintContent: ''
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

  // ---------- V2.3 新增：投诉与建议（含前端本地缓存防刷，每天限1次） ----------
  onOpenComplaint() {
    // 拦截机制：检查本地缓存里记录的"上次投诉日期"是否就是今天
    const lastDate = wx.getStorageSync('last_complaint_date');
    const today = new Date().toDateString();
    if (lastDate === today) {
      wx.showToast({ title: '今天您已经反馈过啦，明天再来吧！', icon: 'none' });
      return; // 直接拦截，不打开输入框
    }
    this.setData({ showComplaintModal: true, complaintContent: '' });
  },

  onCloseComplaintModal() {
    this.setData({ showComplaintModal: false });
  },

  onComplaintInput(e) {
    this.setData({ complaintContent: e.detail.value });
  },

  onSubmitComplaint() {
    if (!this.data.complaintContent.trim()) {
      wx.showToast({ title: '请填写投诉或建议内容', icon: 'none' });
      return;
    }

    // 真实接口： POST /api/suggestion/submit { phone, content }
    mock.submitSuggestion(this.data.profile.myAddress ? '138****1234' : '', this.data.complaintContent);

    // 提交成功后立刻写本地缓存，锁死今天不能再次提交
    const today = new Date().toDateString();
    wx.setStorageSync('last_complaint_date', today);

    this.setData({ showComplaintModal: false });
    wx.showToast({ title: '感谢您的反馈！', icon: 'success' });
  },

  // ---------- V2.3 新增：三端任意门 ----------
  onGoResident() {
    wx.showToast({ title: '您已经在居民端啦', icon: 'none' });
  },

  // [测试用] 一键强制把审核状态改成 approved，并 reLaunch 进商户工作台
  onForceApproveAndEnter() {
    mock.submitMerchantApplication({
      shopName: '张师傅废品回收站',
      contactName: '张师傅',
      phone: '13800001234',
      locationName: '深圳市南山区',
      serviceArea: '深圳市南山区'
    });
    const application = mock.getMerchantApplication();
    application.status = 'approved'; // 测试场景直接跳过"人工审核"这一步
    wx.reLaunch({ url: '/pages/merchant/index/index' });
  },

  // [测试用] 直接进入隐藏管理后台
  onGoAdmin() {
    wx.navigateTo({ url: '/pages/admin/index/index' });
  }
});
