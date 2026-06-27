// pages/mine/mine.js
// ============================================================
// "我的"页面逻辑
// ------------------------------------------------------------
// 核心点：onSwitchToMerchant() 函数。
// 这里演示了"角色判断"的最简单实现方式：
//   把角色写入 app.js 的 globalData.role，
//   然后用 wx.navigateTo 跳转到商户端的页面。
// 真实项目中，"切换角色"前应该先校验该用户是否通过了商户审核
// （对应方案里管理后台的"商家审核表"），原型阶段直接放行。
// ============================================================

const mock = require('../../utils/mock.js');
const config = require('../../config/config.js');

Page({
  data: {
    profile: {}
  },

  onLoad() {
    // 真实接口： GET /api/resident/profile
    this.setData({ profile: mock.getResidentProfile() });
  },

  onAddFamily() {
    wx.showModal({
      title: '亲友代下',
      content: '此处用于绑定父母地址，原型阶段暂不实现具体表单，仅展示入口位置是否合理。',
      showCancel: false
    });
  },

  onContactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服微信号：' + config.CUSTOMER_SERVICE_WECHAT,
      showCancel: false
    });
  },

  // 切换到商户端：演示"同一个小程序，靠角色字段区分功能模块"
  onSwitchToMerchant() {
    const app = getApp();
    app.globalData.role = 'merchant';
    wx.navigateTo({
      url: '/pages/merchant/hall/hall'
    });
  }
});
