// pages/index/index.js —— V1.2
// ============================================================
// 用户端首页逻辑
// ------------------------------------------------------------
// 本次更新：
//   1. 照片改为数组 photoList，最多3张，紧跟按钮下方展示
//   2. 今日回收价新增"查看更多"跳转 pages/priceList
//   3. 地址选择后弹出"门牌号补充"弹窗，拼接成完整地址
//   4. 根据 app.globalData.isBound 渲染"已绑定/未绑定"两套皮肤
// ============================================================

const config = require('../../config/config.js');
const mock = require('../../utils/mock.js');

Page({
  data: {
    isBound: true, // 当前显示状态，onShow 时从 globalData 同步
    boundMerchantName: '张师傅废品回收站',

    priceSourceText: '',
    priceList: [],
    cityName: '', // 未绑定商家时，定位到的城市名

    photoList: [], // 最多3张照片的临时路径数组

    address: '',
    // 地址补充弹窗相关
    showAddressDetailModal: false,
    addressBase: '',   // wx.chooseLocation 拿到的"大致地址"
    addressDetail: '', // 用户手动补充的门牌号

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

    quickTags: [
      { label: '纸箱纸皮', value: 'carton', active: false, text: '纸箱纸皮' },
      { label: '废旧家电', value: 'appliance', active: false, text: '废旧家电' },
      { label: '五金金属', value: 'metal', active: false, text: '五金金属' },
      { label: '塑料瓶/堆', value: 'plastic', active: false, text: '塑料瓶/堆' },
      { label: '衣服被褥', value: 'clothes', active: false, text: '衣服被褥' }
    ],

    remark: ''
  },

  onLoad(options) {
    console.log('页面参数：', options);
  },

  onShow() {
    const app = getApp();
    this.setData({ isBound: app.globalData.isBound });
    this.refreshPeriodOptions(); // 根据当前时间动态算一次"上午/下午"是否可选

    if (this.data.isBound) {
      this.loadPriceList();
    } else {
      this.loadPriceListWithLocation();
    }
  },

  // 根据当前真实时间，计算"今天"还能不能选"上午"：
  // 规则：当前时间超过 12:00，则"今天+上午"不可选（师傅没法回到过去上门）；
  // "明天"永远不受影响，两个时段都可以选。
  refreshPeriodOptions() {
    const now = new Date();
    const isAfterNoon = now.getHours() >= 12;

    const periodOptions = this.data.periodOptions.map(opt => {
      const disabled = (this.data.selectedDate === 'today' && opt.value === 'am' && isAfterNoon);
      return Object.assign({}, opt, { disabled });
    });

    // 如果当前选中的是"今天+上午"，但现在已经不允许选了，自动帮用户切到"今天下午"
    let selectedPeriod = this.data.selectedPeriod;
    if (this.data.selectedDate === 'today' && selectedPeriod === 'am' && isAfterNoon) {
      selectedPeriod = 'pm';
    }

    this.setData({ periodOptions, selectedPeriod });
  },

  // 未绑定商家时：先定位 -> 模拟逆地理编码拿到城市名 -> 展示对应区域价格
  loadPriceListWithLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const cityName = mock.mockReverseGeocode(res.latitude, res.longitude);
        this.setData({ cityName });
        this.loadPriceList();
      },
      fail: (err) => {
        // 模拟器/真机未授权定位时会失败，这里兜底用一个固定城市名，保证演示不中断
        console.log('getLocation 失败，使用兜底城市名', err);
        this.setData({ cityName: '深圳市南山区（模拟定位）' });
        this.loadPriceList();
      }
    });
  },

  loadPriceList() {
    const result = mock.getTodayPriceList(this.data.isBound, this.data.cityName);
    // 首页只展示精选前4项，完整列表在"查看更多"页面
    this.setData({
      priceSourceText: result.sourceText,
      priceList: result.list.slice(0, 4)
    });
  },

  onViewMorePrice() {
    wx.navigateTo({ url: `/pages/priceList/priceList?cityName=${encodeURIComponent(this.data.cityName || '')}` });
  },

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

  // ---------- 拍照下单：最多3张 ----------
  onChoosePhoto() {
    if (this.data.photoList.length >= 3) {
      wx.showToast({ title: '最多上传3张照片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: 3 - this.data.photoList.length,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        const newPaths = res.tempFiles.map(f => f.tempFilePath);
        const merged = this.data.photoList.concat(newPaths).slice(0, 3);
        this.setData({ photoList: merged });
        wx.showToast({ title: '已拍照', icon: 'success' });
      },
      fail: () => {
        console.log('用户取消了拍照/选图');
      }
    });
  },

  onDeletePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const newList = this.data.photoList.filter((_, i) => i !== index);
    this.setData({ photoList: newList });
  },

  onPreviewPhoto(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.photoList[index],
      urls: this.data.photoList
    });
  },

  // ---------- 地址选择：定位/选点后再弹窗补充门牌号 ----------
  onChooseAddress() {
    wx.chooseLocation({
      success: (res) => {
        // wx.chooseLocation 受系统定位精度限制，通常只能精确到"小区/楼栋附近"，
        // 拿不到"A栋具体门牌"这种室内级别的信息（这是地图API本身的限制，不是代码问题）。
        // 所以这里拿到大致地址后，弹窗让用户自己补一句"门牌号/楼层"，拼接成完整地址。
        const baseAddress = res.name ? `${res.name}（${res.address}）` : res.address;
        this.setData({
          addressBase: baseAddress,
          addressDetail: '',
          showAddressDetailModal: true
        });
      },
      fail: (err) => {
        console.log('chooseLocation 失败/取消', err);
        // 区分"用户主动点击取消"和"接口真正失败（如没授权/模拟器未设置位置）"：
        // err.errMsg 在用户取消时通常包含 'cancel'，这种情况下什么都不做即可，
        // 不能弹出"补充门牌信息"弹窗（用户都点取消了，说明暂时不想填地址）。
        if (err.errMsg && err.errMsg.indexOf('cancel') > -1) {
          return;
        }
        this.setData({
          addressBase: '阳光花园小区（模拟定位）',
          addressDetail: '',
          showAddressDetailModal: true
        });
      }
    });
  },

  onAddressDetailInput(e) {
    this.setData({ addressDetail: e.detail.value });
  },

  onCloseAddressModal() {
    this.setData({ showAddressDetailModal: false });
  },

  noop() {},

  onConfirmAddressDetail() {
    const full = this.data.addressDetail
      ? `${this.data.addressBase} ${this.data.addressDetail}`
      : this.data.addressBase;
    this.setData({
      address: full,
      showAddressDetailModal: false
    });
  },

  onSelectDate(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.value }, () => {
      this.refreshPeriodOptions();
    });
  },

  onSelectPeriod(e) {
    const value = e.currentTarget.dataset.value;
    const target = this.data.periodOptions.find(o => o.value === value);
    if (target && target.disabled) {
      wx.showToast({ title: '当前时间已过，无法选择该时段', icon: 'none' });
      return;
    }
    this.setData({ selectedPeriod: value });
  },

  onToggleTag(e) {
    const index = e.currentTarget.dataset.index;
    const quickTags = this.data.quickTags.map((tag, i) => {
      if (i === index) {
        return Object.assign({}, tag, { active: !tag.active });
      }
      return tag;
    });

    const activeTexts = quickTags.filter(t => t.active).map(t => t.text);
    const tagText = activeTexts.join('、');

    const oldManualRemark = this._manualRemark || '';
    const newRemark = tagText
      ? (oldManualRemark ? `${tagText}；${oldManualRemark}` : tagText)
      : oldManualRemark;

    this.setData({ quickTags, remark: newRemark });
  },

  onRemarkInput(e) {
    this._manualRemark = e.detail.value.replace(/^.*；/, '');
    this.setData({ remark: e.detail.value });
  },

  onGoMall() {
    wx.navigateTo({ url: '/pages/mall/mall' });
  },

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
      photoCount: this.data.photoList.length
    };
    console.log('【模拟提交订单】', fakeOrder);

    wx.showToast({ title: '预约成功！', icon: 'success' });

    setTimeout(() => {
      wx.switchTab({ url: '/pages/orderList/orderList' });
    }, 800);
  }
});
