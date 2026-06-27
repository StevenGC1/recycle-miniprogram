// pages/merchant/promotion/promotion.js
// ============================================================
// 商户端 - 推广中心逻辑
// ------------------------------------------------------------
// 真实项目中，"专属推广码"应该是后端生成的一张带参数的小程序码
// （调用微信 wxacode.getUnlimited 接口生成，参数里编码商户ID），
// 原型阶段直接展示一段文字代替图片，重点是验证"这个页面的信息结构"
// 是否清晰，而不是真的生成图片。
// ============================================================

const mock = require('../../../utils/mock.js');

Page({
  data: {
    profile: {}
  },

  onLoad() {
    // 真实接口： GET /api/merchant/profile?id=xxx
    this.setData({ profile: mock.getMerchantProfile() });
  },

  onSaveCode() {
    // 原型阶段没有真实图片可保存，用提示代替
    wx.showToast({ title: '原型演示：真实版本会保存推广码图片到相册', icon: 'none' });
  }
});
