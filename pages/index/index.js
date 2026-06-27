// pages/index/index.js
// ============================================================
// 用户端首页逻辑
// ------------------------------------------------------------
// 本页面所有"提交"动作都不会真正发往后端，只会：
//   1. 打印一条 console.log 方便你在开发者工具里看到数据
//   2. 用 wx.showToast / wx.showModal 给用户一个反馈
// 这样你可以完整体验"点击 -> 反馈"的流程，判断交互是否顺畅，
// 而不需要等后端写完。
// ============================================================

const config = require('../../config/config.js');

Page({
  // ---------- 页面数据 ----------
  data: {
    // 是否是"扫码进来"的熟客场景，原型阶段写死为有绑定商户，方便体验"熟客刷脸"效果
    // 如果想体验"没有绑定商户"的普通进入效果，把下面这行改成 ''
    boundMerchantName: '张师傅废品回收站',

    address: '', // 用户选择/定位的地址，初始为空
    selectedDate: 'today', // 默认选中"今天"
    selectedPeriod: 'am',  // 默认选中"上午"
    dateOptions: [
      { label: '今天', value: 'today' },
      { label: '明天', value: 'tomorrow' }
    ],
    periodOptions: [
      { label: '上午', value: 'am' },
      { label: '下午', value: 'pm' }
    ],
    remark: '',
    tempPhotoPath: '' // 拍照后的临时图片路径
  },

  onLoad(options) {
    // options 是页面跳转参数。
    // 真实场景下，如果用户是"扫描了商户专属码"进入小程序，
    // 这里会拿到类似 options.merchantId 这样的参数，
    // 然后调用后端接口换取商户名称，显示"熟客刷脸"横幅。
    // 原型阶段我们直接在 data 里写死，不做这个判断逻辑。
    console.log('页面参数：', options);
  },

  // ---------- 一键呼叫：直接拨打客服/商户电话 ----------
  onCallPhone() {
    wx.makePhoneCall({
      phoneNumber: config.CUSTOMER_SERVICE_PHONE,
      fail: () => {
        // 在开发者工具模拟器里 makePhoneCall 通常会失败（无法真实拨号），
        // 这里兜底用弹窗告知，保证演示时不会报错卡住。
        wx.showModal({
          title: '一键呼叫',
          content: '模拟器无法真实拨号，真机环境下会直接拨打：' + config.CUSTOMER_SERVICE_PHONE,
          showCancel: false
        });
      }
    });
  },

  // ---------- 拍照下单：调用相机/相册 ----------
  onChoosePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        this.setData({ tempPhotoPath: tempPath });
        wx.showToast({ title: '已选择照片', icon: 'success' });
      },
      fail: () => {
        // 用户取消选择或模拟器不支持摄像头时，静默处理，不报错
        console.log('用户取消了拍照/选图');
      }
    });
  },

  // ---------- 选择地址：调用微信定位 ----------
  onChooseAddress() {
    // 真实项目这里会调用 wx.chooseLocation 让用户在地图上选点，
    // 该接口需要先在小程序管理后台开通"位置信息"权限。
    // 原型阶段为了不依赖任何额外配置，先用 wx.getLocation 模拟"一键导入定位"，
    // 拿到经纬度后直接写一个 Mock 地址文本。
    wx.showModal({
      title: '选择地址',
      content: '原型阶段：点击"使用当前定位"将自动填入模拟地址',
      confirmText: '使用当前定位',
      success: (res) => {
        if (res.confirm) {
          this.setData({ address: '阳光花园小区 3 号楼 2 单元 502 室（定位导入）' });
        }
      }
    });
  },

  onSelectDate(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.value });
  },

  onSelectPeriod(e) {
    this.setData({ selectedPeriod: e.currentTarget.dataset.value });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // ---------- 提交预约 ----------
  onSubmitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: '请先选择上门地址', icon: 'none' });
      return;
    }

    // 真实接口： wx.request({ url: '/api/order/create', method: 'POST', data: {...} })
    const fakeOrder = {
      address: this.data.address,
      date: this.data.selectedDate,
      period: this.data.selectedPeriod,
      remark: this.data.remark,
      hasPhoto: !!this.data.tempPhotoPath
    };
    console.log('【模拟提交订单】', fakeOrder);

    wx.showToast({ title: '预约成功！', icon: 'success' });

    // 提交成功后跳转到订单列表页，让用户看到"刚下的单"
    // （注意：因为是 mock 数据，订单列表里看到的还是写死的 3 条假订单，
    //  不会真的多出一条，这是原型阶段的正常现象）
    setTimeout(() => {
      wx.switchTab({ url: '/pages/orderList/orderList' });
    }, 800);
  }
});
