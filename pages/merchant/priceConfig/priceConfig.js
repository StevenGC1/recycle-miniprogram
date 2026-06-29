// pages/merchant/priceConfig/priceConfig.js
// ============================================================
// 商户中心 - 自定义报价逻辑
// ------------------------------------------------------------
// 编辑时只改本页面 data 里的临时副本，点击【保存修改】才统一调用
// mock.updateMerchantPrice() 真正写回"数据库"（mock.js 里的可变数组），
// 这样可以避免每敲一个数字就触发一次"写库"，也更接近真实接口的设计模式。
// ============================================================

const mock = require('../../../utils/mock.js');

Page({
  data: {
    categoryList: []
  },

  onLoad() {
    // hasBoundMerchant 传 true，拿商户自己的价格表来编辑
    const result = mock.getPriceCategoryList(true);
    // 做一次深拷贝，避免直接改到 mock.js 里的原始数组引用（保存前不应该提前生效）
    const categoryListCopy = JSON.parse(JSON.stringify(result.list));
    this.setData({ categoryList: categoryListCopy });
  },

  onPriceInput(e) {
    const { category, name } = e.currentTarget.dataset;
    const newPrice = e.detail.value;

    const categoryList = this.data.categoryList.map(cat => {
      if (cat.category !== category) return cat;
      const items = cat.items.map(item => {
        if (item.name !== name) return item;
        return Object.assign({}, item, { price: newPrice });
      });
      return Object.assign({}, cat, { items });
    });

    this.setData({ categoryList });
  },

  onSaveAll() {
    // 把本页面临时副本里的每一项，逐一调用 mock.updateMerchantPrice 写回"数据库"
    this.data.categoryList.forEach(cat => {
      cat.items.forEach(item => {
        mock.updateMerchantPrice(cat.category, item.name, item.price);
      });
    });

    wx.showToast({ title: '报价已更新，居民端将同步显示', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
