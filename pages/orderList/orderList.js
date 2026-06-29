// pages/orderList/orderList.js —— V1.6
// ============================================================
// 用户端订单列表页逻辑
// ------------------------------------------------------------
// 数据来源：utils/mock.js 里写死的 3 条假订单（一条待接单/一条待上门/一条已完成）
// 核心逻辑：
//   1. 根据顶部 tab 选择的状态，对全量订单做前端筛选（filteredOrders）
//   2. "取消订单"只是从内存里的列表中移除，刷新页面是 demo（不会真的请求后端）
//   3. V1.6 新增：已完成订单的"评价服务"弹窗（星级 + 差评标签 + 提交）
// ============================================================

const mock = require('../../utils/mock.js');

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
    allOrders: [],
    filteredOrders: [],

    // ---------- V1.6 评价弹窗相关 ----------
    showCommentModal: false,
    currentCommentOrderId: '', // 正在评价的订单号
    currentRating: 0,          // 当前选中的星级，0表示未选
    starList: [1, 2, 3, 4, 5],
    badTags: [
      { label: '上门慢', value: 'slow', active: false },
      { label: '态度差', value: 'rude', active: false },
      { label: '估价低', value: 'low_price', active: false },
      { label: '未按约定时间', value: 'late', active: false }
    ]
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

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
  },

  // ---------- V1.6 评价相关 ----------

  // 点击【评价服务】，打开弹窗，重置星级和标签状态
  onOpenCommentModal(e) {
    const orderId = e.currentTarget.dataset.id;
    const resetTags = this.data.badTags.map(t => Object.assign({}, t, { active: false }));
    this.setData({
      showCommentModal: true,
      currentCommentOrderId: orderId,
      currentRating: 0,
      badTags: resetTags
    });
  },

  onCloseCommentModal() {
    this.setData({ showCommentModal: false });
  },

  noop() {},

  onSelectRating(e) {
    const value = Number(e.currentTarget.dataset.value);
    this.setData({ currentRating: value });
  },

  onToggleBadTag(e) {
    const index = e.currentTarget.dataset.index;
    const badTags = this.data.badTags.map((tag, i) => {
      if (i === index) {
        return Object.assign({}, tag, { active: !tag.active });
      }
      return tag;
    });
    this.setData({ badTags });
  },

  // 提交评价：调用 mock.submitOrderComment 模拟"写库"，并联动积分提示
  onSubmitComment() {
    if (!this.data.currentRating) {
      wx.showToast({ title: '请先选择星级', icon: 'none' });
      return;
    }

    const selectedTags = this.data.badTags.filter(t => t.active).map(t => t.label);

    // 真实接口： POST /api/order/comment { orderId, rating, tags }
    mock.submitOrderComment(this.data.currentCommentOrderId, this.data.currentRating, selectedTags);
    console.log('【模拟提交评价】订单：', this.data.currentCommentOrderId, '星级：', this.data.currentRating, '标签：', selectedTags);

    this.setData({ showCommentModal: false });

    // 局部刷新：把对应订单标记为已评价，不用整页重新拉取
    const newAllOrders = this.data.allOrders.map(order => {
      if (order.orderId === this.data.currentCommentOrderId) {
        return Object.assign({}, order, {
          is_commented: true,
          rating: this.data.currentRating
        });
      }
      return order;
    });
    this.setData({ allOrders: newAllOrders }, () => {
      this.applyFilter();
    });

    // 积分翻倍/联动激励提示，对应"记账与积分"留存策略的延伸：
    // 评价完成后给点额外好处，鼓励用户走完整个流程
    wx.showToast({ title: '感谢评价，获得额外 5 积分！', icon: 'success', duration: 2000 });
  }
});

