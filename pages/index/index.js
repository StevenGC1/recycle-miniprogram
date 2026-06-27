// pages/index/index.js —— V1.1
// ============================================================
// 用户端首页逻辑
// ------------------------------------------------------------
// 本次更新（对应 PRD V1.1）：
//   1. onChooseAddress 改为真实调用 wx.chooseLocation 地图选点
//   2. 拍照后的图片以缩略图形式管理（onDeletePhoto / onPreviewPhoto 新增）
//   3. 新增今日回收价加载逻辑（loadPriceList）
//   4. 新增快捷标签逻辑（onToggleTag），点击后自动拼接备注文字
//   5. 新增 onGoMall 跳转到二手/积分商城
// 仍然不连接真实后端，所有"提交"动作只做前端反馈，方便你体验流程。
// ============================================================

const config = require('../../config/config.js');
const mock = require('../../utils/mock.js');

Page({
  // ---------- 页面数据 ----------
  data: {
    // 是否是"扫码进来"的熟客场景，原型阶段写死为有绑定商户，方便体验"熟客刷脸"效果
    boundMerchantName: '张师傅废品回收站',
    // 是否绑定了专属商家，决定"今日回收价"展示哪套价格（与上面banner联动，保持业务一致）
    hasBoundMerchant: true,

    priceSourceText: '', // 价格来源文案，如"专属商家价格" / "本市平台参考价"
    priceList: [],       // 今日回收价列表

    address: '', // 用户选择/定位的地址，初始为空
    selectedDate: 'today',
    selectedPeriod: 'am',
    dateOptions: [
      { label: '今天', value: 'today' },
      { label: '明天', value: 'tomorrow' }
    ],
    periodOptions: [
      { label: '上午', value: 'am' },
      { label: '下午', value: 'pm' }
    ],

    // 快捷标签：active 控制是否高亮，text 是点击后追加进备注的文字
    quickTags: [
      { label: '纸箱纸皮', value: 'carton', active: false, text: '纸箱纸皮' },
      { label: '废旧家电', value: 'appliance', active: false, text: '废旧家电' },
      { label: '五金金属', value: 'metal', active: false, text: '五金金属' },
      { label: '塑料瓶/堆', value: 'plastic', active: false, text: '塑料瓶/堆' },
      { label: '衣服被褥', value: 'clothes', active: false, text: '衣服被褥' }
    ],

    remark: '',
    tempPhotoPath: '' // 拍照后的临时图片路径
  },

  onLoad(options) {
    console.log('页面参数：', options);
    this.loadPriceList();
  },

  // ---------- 加载"今日回收价" ----------
  loadPriceList() {
    const result = mock.getTodayPriceList(this.data.hasBoundMerchant);
    this.setData({
      priceSourceText: result.sourceText,
      priceList: result.list
    });
  },

  // ---------- 一键呼叫：直接拨打客服/商户电话 ----------
  onCallPhone() {
    wx.makePhoneCall({
      phoneNumber: config.CUSTOMER_SERVICE_PHONE,
      fail: () => {
        wx.showModal({
          title: '一键呼叫',
          content: '模拟器无法真实拨号，真机环境下会直接拨打：' + config.CUSTOMER_SERVICE_PHONE,
          showCancel: false
        });
      }
    });
  },

  // ---------- 拍照下单：调用相机/相册 ----------
  // 这个函数现在被两处调用：1) 顶部【拍照下单】大按钮 2) 缩略图旁的【重拍】按钮
  onChoosePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        this.setData({ tempPhotoPath: tempPath });
        wx.showToast({ title: '已拍照', icon: 'success' });
      },
      fail: () => {
        console.log('用户取消了拍照/选图');
      }
    });
  },

  // 删除已拍的照片
  onDeletePhoto() {
    this.setData({ tempPhotoPath: '' });
  },

  // 点击缩略图放大预览
  onPreviewPhoto() {
    if (!this.data.tempPhotoPath) return;
    wx.previewImage({
      urls: [this.data.tempPhotoPath]
    });
  },

  // ---------- 选择地址：真实调用微信地图选点 ----------
  onChooseAddress() {
    // wx.chooseLocation 需要小程序在管理后台开通"位置信息"接口权限，
    // 且 app.json 中通常需要配置 permission 字段说明使用定位的原因（原型阶段先不强制配置）。
    // 在没有权限/没有Key/模拟器不支持的情况下会触发 fail，这里做了兜底，
    // 用一个"模拟选点"弹窗代替，保证演示不会卡住。
    wx.chooseLocation({
      success: (res) => {
        // res.address 是详细地址，res.name 是地点名称
        const fullAddress = res.name ? `${res.name}（${res.address}）` : res.address;
        this.setData({ address: fullAddress });
      },
      fail: (err) => {
        console.log('chooseLocation 失败，使用兜底方案', err);
        wx.showModal({
          title: '选择地址',
          content: '当前环境无法调起地图选点（常见于模拟器未配置定位权限），点击"使用模拟地址"继续体验流程',
          confirmText: '使用模拟地址',
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.setData({ address: '阳光花园小区 3 号楼 2 单元 502 室（模拟定位）' });
            }
          }
        });
      }
    });
  },

  onSelectDate(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.value });
  },

  onSelectPeriod(e) {
    this.setData({ selectedPeriod: e.currentTarget.dataset.value });
  },

  // ---------- 快捷标签：点击切换高亮，并重新拼接备注文字 ----------
  onToggleTag(e) {
    const index = e.currentTarget.dataset.index;
    const quickTags = this.data.quickTags.map((tag, i) => {
      if (i === index) {
        return Object.assign({}, tag, { active: !tag.active });
      }
      return tag;
    });

    // 把所有"高亮中"的标签文字按顺序拼接，作为备注的"标签部分"，
    // 如果用户自己还手动输入了别的文字，会保留在标签后面（用 / 分隔）
    const activeTexts = quickTags.filter(t => t.active).map(t => t.text);
    const tagText = activeTexts.join('、');

    // 简化策略：把备注里"已知的标签词"先清空，再重新拼上当前高亮的标签 + 用户自己写的尾巴
    // （原型阶段不做复杂的文本diff，保证逻辑简单可读）
    const oldManualRemark = this._manualRemark || '';
    const newRemark = tagText
      ? (oldManualRemark ? `${tagText}；${oldManualRemark}` : tagText)
      : oldManualRemark;

    this.setData({ quickTags, remark: newRemark });
  },

  // 用户手动在输入框里打字时，单独记录"手动输入的部分"，避免和标签拼接时互相覆盖
  onRemarkInput(e) {
    this._manualRemark = e.detail.value.replace(/^.*；/, ''); // 粗略去掉标签拼接的前缀
    this.setData({ remark: e.detail.value });
  },

  // ---------- 跳转商城 ----------
  onGoMall() {
    wx.navigateTo({ url: '/pages/mall/mall' });
  },

  // ---------- 提交预约 ----------
  onSubmitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: '请先选择上门地址', icon: 'none' });
      return;
    }

    const fakeOrder = {
      address: this.data.address,
      date: this.data.selectedDate,
      period: this.data.selectedPeriod,
      remark: this.data.remark,
      hasPhoto: !!this.data.tempPhotoPath
    };
    console.log('【模拟提交订单】', fakeOrder);

    wx.showToast({ title: '预约成功！', icon: 'success' });

    setTimeout(() => {
      wx.switchTab({ url: '/pages/orderList/orderList' });
    }, 800);
  }
});
