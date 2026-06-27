// pages/mall/mall.js
// ============================================================
// 二手/积分商城逻辑
// ------------------------------------------------------------
// 真实接口应该是： GET /api/mall/items?merchantId=用户绑定的parent_merchant_id
// 原型阶段直接从 mock.js 拿写死的 3 件"张师傅"上架的物品。
// ============================================================

const mock = require('../../utils/mock.js');

Page({
  data: {
    merchantName: '张师傅废品回收站', // 与首页"熟客刷脸"保持一致的绑定商家
    itemList: []
  },

  onLoad() {
    this.setData({ itemList: mock.getMallItemList() });
  },

  onPointsTabTip() {
    wx.showToast({ title: '积分商城功能规划中，先看二手车间', icon: 'none' });
  },

  onBuyItem(e) {
    const name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '下单确认',
      content: `「${name}」商家将在下次上门回收时顺路配送，或支持自提。是否确认下单？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '下单成功（原型演示）', icon: 'success' });
        }
      }
    });
  }
});
