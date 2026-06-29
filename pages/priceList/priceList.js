// pages/priceList/priceList.js
// ============================================================
// 回收价格表详情页逻辑
// ------------------------------------------------------------
// 数据来源：mock.getPriceCategoryList(isBound, cityName)
// 城市名优先用首页传过来的 options.cityName（避免重复定位、体验更连贯），
// 如果是直接进到这个页面（比如没有从首页带参数过来），才自己重新定位一次。
// ============================================================

const mock = require('../../utils/mock.js');

Page({
  data: {
    sourceText: '',
    categoryList: []
  },

  onLoad(options) {
    const app = getApp();
    const isBound = app.globalData.isBound;

    if (isBound) {
      // 已绑定商家，不需要定位，直接展示商家自定义价格
      this.renderList(isBound, '');
      return;
    }

    // 未绑定商家：优先用首页传过来的城市名
    const cityNameFromIndex = options.cityName ? decodeURIComponent(options.cityName) : '';
    if (cityNameFromIndex) {
      this.renderList(isBound, cityNameFromIndex);
    } else {
      // 没有传城市名（比如直接打开这个页面），自己定位一次
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          const cityName = mock.mockReverseGeocode(res.latitude, res.longitude);
          this.renderList(isBound, cityName);
        },
        fail: () => {
          this.renderList(isBound, '深圳市南山区（模拟定位）');
        }
      });
    }
  },

  renderList(isBound, cityName) {
    const result = mock.getPriceCategoryList(isBound, cityName);
    this.setData({
      sourceText: result.sourceText,
      categoryList: result.list
    });
  }
});
