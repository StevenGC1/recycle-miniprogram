// pages/merchantApply/merchantApply.js —— V2.3
// ============================================================
// 申请成为回收商 - 表单逻辑
// ------------------------------------------------------------
// 1. onLoad 时先查一次申请状态：如果已经是 pending/approved/rejected，
//    说明已经提交过，直接 redirectTo 跳到结果页，避免重复填表
// 2. isSubmitting 防重复提交：点击后按钮立刻变灰+文案变化，
//    成功后 wx.redirectTo（不是 navigateTo）跳到结果页，
//    redirectTo 会关闭当前表单页，用户没法点左上角返回按钮回到表单
// ============================================================

const mock = require('../../utils/mock.js');

Page({
  data: {
    shopName: '',
    contactName: '',
    phone: '',
    locationName: '',
    latitude: null,
    longitude: null,
    photoPath: '',
    isSubmitting: false
  },

  onLoad() {
    const application = mock.getMerchantApplication();
    if (application.status !== 'none') {
      // 已经提交过申请（不管是审核中/已通过/被驳回），直接去结果页，不显示表单
      wx.redirectTo({ url: '/pages/applyResult/applyResult' });
    }
  },

  onShopNameInput(e) {
    this.setData({ shopName: e.detail.value });
  },
  onContactNameInput(e) {
    this.setData({ contactName: e.detail.value });
  },
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  // 一键导入微信手机号：需要小程序已认证 + 用户授权，
  // 模拟器/没认证的小程序点击通常会拿不到号码，这里做了兜底提示
  onGetPhoneNumber(e) {
    if (e.detail.code) {
      // 真实项目：把 e.detail.code 发给后端，后端调用微信接口换取真实手机号
      wx.showToast({ title: '已获取微信手机号（需后端解密）', icon: 'none' });
    } else {
      wx.showToast({ title: '未授权或当前环境不支持一键导入，请手动输入', icon: 'none' });
    }
  },

  // 地图选点：与首页地址选择逻辑类似，但这里不需要"补充门牌号"，
  // 因为网点坐标只需要大致位置即可，不需要精确到门牌
  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        const locationName = res.name ? `${res.name}（${res.address}）` : res.address;
        this.setData({
          locationName,
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) return;
        // 模拟器没设置位置时的兜底
        this.setData({
          locationName: '深圳市南山区某街道（模拟定位）',
          latitude: 22.53,
          longitude: 113.93
        });
      }
    });
  },

  onChoosePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        this.setData({ photoPath: res.tempFiles[0].tempFilePath });
      },
      fail: () => {}
    });
  },

  onDeletePhoto() {
    this.setData({ photoPath: '' });
  },

  onSubmitApply() {
    if (this.data.isSubmitting) return; // 防止重复点击触发多次提交

    if (!this.data.shopName || !this.data.contactName || !this.data.phone) {
      wx.showToast({ title: '请填写完整的店铺名称/姓名/电话', icon: 'none' });
      return;
    }
    if (!this.data.locationName) {
      wx.showToast({ title: '请选择回收常驻网点位置', icon: 'none' });
      return;
    }

    this.setData({ isSubmitting: true });

    // 模拟一个简单的提交耗时，让"提交中..."状态能被你看到效果
    setTimeout(() => {
      mock.submitMerchantApplication({
        shopName: this.data.shopName,
        contactName: this.data.contactName,
        phone: this.data.phone,
        locationName: this.data.locationName,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        photoPath: this.data.photoPath,
        serviceArea: this.data.locationName
      });

      // redirectTo 而不是 navigateTo：关闭当前表单页，用户无法返回重新填表
      wx.redirectTo({ url: '/pages/applyResult/applyResult' });
    }, 800);
  }
});
