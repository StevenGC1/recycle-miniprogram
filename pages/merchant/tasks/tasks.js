// pages/merchant/tasks/tasks.js
// ============================================================
// 商户端 - 我的任务页逻辑
// ------------------------------------------------------------
// 数据来源：mock.getMerchantTaskList(merchantId)
// 三个核心动作：
//   1. onCallResident  - 拨打居民电话（wx.makePhoneCall）
//   2. onNavigate      - 一键导航（wx.openLocation，原型阶段用模拟坐标）
//   3. onConfirmDone   - 确认完成 -> 弹出"记账"弹窗 -> 输入重量 -> 发放积分
//
// "记账与积分"弹窗是对应方案里"反跑单"策略的核心交互：
// 商户必须在小程序里完成这个动作才能"标记订单完成"，
// 这就是让商户离不开小程序的关键设计点。
// ============================================================

const mock = require('../../../utils/mock.js');

// 复用订单列表页一样的状态映射
const STATUS_MAP = {
  accepted: { text: '待上门', tagClass: 'tag-accepted' },
  done: { text: '已完成', tagClass: 'tag-done' }
};

Page({
  data: {
    taskList: [],
    showSettleModal: false, // 是否展示"记账"弹窗
    settleWeight: '',       // 弹窗里输入的重量
    currentSettleOrderId: '' // 当前正在结算的订单号
  },

  onLoad() {
    this.loadTasks();
  },

  onShow() {
    this.loadTasks();
  },

  loadTasks() {
    // 当前登录商户的 ID，原型阶段直接从 app.globalData.mockUser 里取
    const app = getApp();
    const merchantId = app.globalData.mockUser.merchantId;

    // 真实接口： GET /api/merchant/task/list?merchantId=xxx
    const rawList = mock.getMerchantTaskList(merchantId);
    const processedList = rawList.map(order => {
      const statusInfo = STATUS_MAP[order.status] || { text: '', tagClass: '' };
      return Object.assign({}, order, {
        statusText: statusInfo.text,
        statusTagClass: statusInfo.tagClass
      });
    });
    this.setData({ taskList: processedList });
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
    // 真实项目需要先把地址转换成经纬度（地理编码），这里用固定的模拟坐标（北京天安门）代替
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

  // 点击"确认完成" -> 打开记账弹窗
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

  // 占位函数：用于 wxml 里阻止点击弹窗内容时穿透关闭弹窗
  noop() {},

  // 提交记账：原型阶段只在前端内存里把订单状态改成 done，并附上重量/积分字段
  onSubmitSettle() {
    const weight = Number(this.data.settleWeight);
    if (!weight || weight <= 0) {
      wx.showToast({ title: '请输入有效重量', icon: 'none' });
      return;
    }

    // 真实接口： POST /api/order/settle { orderId, weight, points }
    console.log('【模拟记账】订单：', this.data.currentSettleOrderId, '重量：', weight, '积分：', weight);

    const newTaskList = this.data.taskList.map(order => {
      if (order.orderId === this.data.currentSettleOrderId) {
        return Object.assign({}, order, {
          status: 'done',
          statusText: '已完成',
          statusTagClass: 'tag-done',
          weight: weight,
          pointsEarned: weight
        });
      }
      return order;
    });

    this.setData({
      taskList: newTaskList,
      showSettleModal: false
    });

    wx.showToast({ title: '已完成，积分已发放', icon: 'success' });
  }
});
