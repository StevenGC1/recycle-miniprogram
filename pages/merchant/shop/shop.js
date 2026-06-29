// pages/merchant/shop/shop.js —— V1.9
// ============================================================
// 商户端 - 商户货架逻辑
// ------------------------------------------------------------
// 这里发布的商品，merchant_id 自动关联当前商户（原型阶段直接取
// app.globalData.mockUser.merchantId），只会出现在这个商户绑定客户的
// "二手商城"里。
// ============================================================

const mock = require('../../../utils/mock.js');

const STATUS_TEXT_MAP = {
  pending_review: '待审核',
  on_sale: '在售',
  sold: '已售',
  off_shelf: '已下架',
  rejected: '已驳回'
};

Page({
  data: {
    itemList: [],

    showPublishModal: false,
    publishPhotoList: [],
    publishName: '',
    publishPrice: '',
    publishStock: ''
  },

  onShow() {
    this.loadItemList();
  },

  loadItemList() {
    const merchantId = getApp().globalData.mockUser.merchantId;
    const rawList = mock.getShopItemList(merchantId);
    const processedList = rawList.map(item =>
      Object.assign({}, item, { statusText: STATUS_TEXT_MAP[item.status] || item.status })
    );
    this.setData({ itemList: processedList });
  },

  onOpenPublishModal() {
    this.setData({
      showPublishModal: true,
      publishPhotoList: [],
      publishName: '',
      publishPrice: '',
      publishStock: ''
    });
  },

  onCloseModal() {
    this.setData({ showPublishModal: false });
  },

  noop() {},

  onChoosePublishPhoto() {
    if (this.data.publishPhotoList.length >= 3) {
      wx.showToast({ title: '最多上传3张照片', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: 3 - this.data.publishPhotoList.length,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        const newPaths = res.tempFiles.map(f => f.tempFilePath);
        const merged = this.data.publishPhotoList.concat(newPaths).slice(0, 3);
        this.setData({ publishPhotoList: merged });
      },
      fail: () => {}
    });
  },

  onPublishNameInput(e) {
    this.setData({ publishName: e.detail.value });
  },
  onPublishPriceInput(e) {
    this.setData({ publishPrice: e.detail.value });
  },
  onPublishStockInput(e) {
    this.setData({ publishStock: e.detail.value });
  },

  onSubmitPublish() {
    if (!this.data.publishName || !this.data.publishPrice) {
      wx.showToast({ title: '请填写商品名称和标价', icon: 'none' });
      return;
    }

    const merchantId = getApp().globalData.mockUser.merchantId;
    const merchantName = getApp().globalData.mockUser.merchantName;
    mock.addShopItem(
      merchantId,
      merchantName,
      this.data.publishName,
      this.data.publishPrice,
      Number(this.data.publishStock) || 1,
      this.data.publishPhotoList
    );

    this.setData({ showPublishModal: false });
    wx.showToast({ title: '已提交，等待平台审核', icon: 'none' });
    this.loadItemList();
  },

  onOffShelf(e) {
    const itemId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '下架商品',
      content: '确定要下架这件商品吗？下架后用户端商城将不再展示。',
      success: (res) => {
        if (res.confirm) {
          mock.updateShopItemStatus(itemId, 'off_shelf');
          this.loadItemList();
          wx.showToast({ title: '已下架', icon: 'none' });
        }
      }
    });
  },

  onMarkSold(e) {
    const itemId = e.currentTarget.dataset.id;
    mock.updateShopItemStatus(itemId, 'sold');
    this.loadItemList();
    wx.showToast({ title: '已标记为已售', icon: 'success' });
  }
});
