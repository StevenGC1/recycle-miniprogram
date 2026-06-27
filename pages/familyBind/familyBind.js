// pages/familyBind/familyBind.js
// ============================================================
// 亲友代下页面逻辑
// ------------------------------------------------------------
// 地址选择同样调用 wx.chooseLocation，失败时兜底用模拟地址，
// 与首页 onChooseAddress 的写法保持一致，方便你对比两处代码。
// "保存绑定"只存在页面内存里（Page.data.familyList），
// 原型阶段不持久化，重新进入页面会清空，这是预期内的简化。
// ============================================================

Page({
  data: {
    familyName: '',
    familyAddress: '',
    familyPhone: '',
    familyList: [] // 已绑定的亲友列表，本地内存维护
  },

  onNameInput(e) {
    this.setData({ familyName: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ familyPhone: e.detail.value });
  },

  // 与首页一致的地址选点逻辑
  onChooseAddress() {
    wx.chooseLocation({
      success: (res) => {
        const fullAddress = res.name ? `${res.name}（${res.address}）` : res.address;
        this.setData({ familyAddress: fullAddress });
      },
      fail: (err) => {
        console.log('chooseLocation 失败，使用兜底方案', err);
        wx.showModal({
          title: '选择地址',
          content: '当前环境无法调起地图选点，点击"使用模拟地址"继续体验流程',
          confirmText: '使用模拟地址',
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.setData({ familyAddress: '幸福里小区 8 号楼 1 单元 101 室（模拟定位）' });
            }
          }
        });
      }
    });
  },

  onSaveFamily() {
    if (!this.data.familyName || !this.data.familyAddress) {
      wx.showToast({ title: '请填写称呼并选择地址', icon: 'none' });
      return;
    }

    // 真实接口： POST /api/family/bind { name, address, phone }
    const newItem = {
      id: 'F' + Date.now(),
      name: this.data.familyName,
      address: this.data.familyAddress,
      phone: this.data.familyPhone
    };

    this.setData({
      familyList: [newItem].concat(this.data.familyList),
      familyName: '',
      familyAddress: '',
      familyPhone: ''
    });

    wx.showToast({ title: '绑定成功', icon: 'success' });
  },

  // 点击"为他预约"：原型阶段直接提示，真实版本应跳转首页并预填该亲友地址
  onBookForFamily(e) {
    const id = e.currentTarget.dataset.id;
    const family = this.data.familyList.find(f => f.id === id);
    wx.showModal({
      title: '为父母预约',
      content: `将为「${family.name}」（${family.address}）创建预约，后续会跳转到首页预填该地址（原型阶段先做提示）`,
      showCancel: false
    });
  }
});
