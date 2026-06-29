// pages/admin/index/index.js
// ============================================================
// 隐藏管理后台逻辑
// ------------------------------------------------------------
// 用一个 currentPanel 字段控制4个面板的切换显示，
// 每个面板对应的数据加载/操作函数都调用 utils/mock.js 里 V2.3 新增的函数。
// ============================================================

const mock = require('../../../utils/mock.js');

Page({
  data: {
    panelTabs: [
      { label: '用户管理', value: 'users' },
      { label: '商户管理', value: 'merchants' },
      { label: '货架审核', value: 'shopCheck' },
      { label: '投诉建议', value: 'suggestions' }
    ],
    currentPanel: 'users',

    // 面板1：用户管理
    userKeyword: '',
    userList: [],

    // 面板2：商户管理
    merchantSubTab: 'apply',
    pendingApplications: [],
    boardSortBy: 'points',
    merchantBoardList: [],

    // 面板3：货架审核
    pendingShopItems: [],

    // 面板4：投诉建议
    suggestionList: [],

    // 驳回弹窗
    showRejectModal: false,
    currentRejectApplicantId: '',
    rejectReason: ''
  },

  onShow() {
    this.loadCurrentPanelData();
  },

  loadCurrentPanelData() {
    switch (this.data.currentPanel) {
      case 'users':
        this.loadUserList();
        break;
      case 'merchants':
        this.loadPendingApplications();
        this.loadMerchantBoard();
        break;
      case 'shopCheck':
        this.loadPendingShopItems();
        break;
      case 'suggestions':
        this.loadSuggestionList();
        break;
    }
  },

  onSwitchPanel(e) {
    this.setData({ currentPanel: e.currentTarget.dataset.value }, () => {
      this.loadCurrentPanelData();
    });
  },

  // ---------- 面板1：用户管理 ----------
  loadUserList() {
    this.setData({ userList: mock.getUserList(this.data.userKeyword) });
  },
  onUserKeywordInput(e) {
    this.setData({ userKeyword: e.detail.value });
  },
  onSearchUser() {
    this.loadUserList();
  },
  onBanUser(e) {
    const userId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '封禁账号',
      content: '确定封禁该用户吗？封禁后该用户两端均无法下单。',
      success: (res) => {
        if (res.confirm) {
          mock.banUser(userId);
          this.loadUserList();
          wx.showToast({ title: '已封禁', icon: 'none' });
        }
      }
    });
  },
  onUnbanUser(e) {
    mock.unbanUser(e.currentTarget.dataset.id);
    this.loadUserList();
    wx.showToast({ title: '已解禁', icon: 'success' });
  },

  // ---------- 面板2：商户管理与审批 ----------
  onSwitchMerchantSubTab(e) {
    this.setData({ merchantSubTab: e.currentTarget.dataset.value });
  },

  loadPendingApplications() {
    this.setData({ pendingApplications: mock.getPendingApplications() });
  },

  loadMerchantBoard() {
    this.setData({ merchantBoardList: mock.getMerchantBoardList(this.data.boardSortBy) });
  },

  onSortBoard(e) {
    this.setData({ boardSortBy: e.currentTarget.dataset.sort }, () => {
      this.loadMerchantBoard();
    });
  },

  onViewPhoto(e) {
    const photo = e.currentTarget.dataset.photo;
    if (photo) {
      wx.previewImage({ urls: [photo] });
    } else {
      wx.showToast({ title: '该申请人未上传照片', icon: 'none' });
    }
  },

  onApproveApplication(e) {
    const applicantId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '准予入驻',
      content: '确认通过该商户的入驻申请吗？通过后将自动开通其商户端权限。',
      success: (res) => {
        if (res.confirm) {
          mock.approveApplication(applicantId);
          this.loadPendingApplications();
          wx.showToast({ title: '已准予入驻', icon: 'success' });
        }
      }
    });
  },

  onOpenRejectModal(e) {
    this.setData({
      showRejectModal: true,
      currentRejectApplicantId: e.currentTarget.dataset.id,
      rejectReason: ''
    });
  },
  onCloseRejectModal() {
    this.setData({ showRejectModal: false });
  },
  noop() {},
  onRejectReasonInput(e) {
    this.setData({ rejectReason: e.detail.value });
  },
  onConfirmReject() {
    if (!this.data.rejectReason.trim()) {
      wx.showToast({ title: '请填写驳回原因', icon: 'none' });
      return;
    }
    mock.rejectApplication(this.data.currentRejectApplicantId, this.data.rejectReason);
    this.setData({ showRejectModal: false });
    this.loadPendingApplications();
    wx.showToast({ title: '已驳回', icon: 'none' });
  },

  onBlacklistMerchant(e) {
    const merchantId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '拉黑该商户',
      content: '确认拉黑该商户吗？拉黑后其将无法继续接单。',
      success: (res) => {
        if (res.confirm) {
          mock.blacklistMerchant(merchantId);
          this.loadMerchantBoard();
          wx.showToast({ title: '已拉黑', icon: 'none' });
        }
      }
    });
  },

  // ---------- 面板3：货架审核 ----------
  loadPendingShopItems() {
    this.setData({ pendingShopItems: mock.getPendingShopItems() });
  },
  onApproveShopItem(e) {
    mock.approveShopItem(e.currentTarget.dataset.id);
    this.loadPendingShopItems();
    wx.showToast({ title: '已允许上架', icon: 'success' });
  },
  onRejectShopItem(e) {
    mock.rejectShopItem(e.currentTarget.dataset.id);
    this.loadPendingShopItems();
    wx.showToast({ title: '已拒绝上架', icon: 'none' });
  },

  // ---------- 面板4：投诉建议 ----------
  loadSuggestionList() {
    this.setData({ suggestionList: mock.getSuggestionList() });
  },
  onCallSuggestionUser(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        wx.showModal({ title: '拨打电话', content: '模拟器无法真实拨号，真机会拨打：' + phone, showCancel: false });
      }
    });
  },
  onMarkHandled(e) {
    mock.markSuggestionHandled(e.currentTarget.dataset.id);
    this.loadSuggestionList();
    wx.showToast({ title: '已标记为已处理', icon: 'success' });
  }
});
