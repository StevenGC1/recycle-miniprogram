// app.js —— V1.9
// ============================================================
// 小程序入口文件。
// V1.9 新增核心逻辑：身份判定与自动分流（对应 PRD"商户怎么注册/如何判定谁是谁"）
//   1. 模拟"静默登录"：原型阶段没有真实 openid，直接跳过
//   2. 查询商户审核状态：mock.getMerchantApplication()
//   3. 分流：
//      - status === 'approved' -> wx.reLaunch 强行拉进商户工作台
//      - 其他情况（none / pending） -> 留在用户端首页，不做任何跳转
// 真实项目里第2步要换成 wx.cloud.callFunction 查云数据库，
// 原型阶段直接读 utils/mock.js 里的内存数据。
// ============================================================

const mock = require('./utils/mock.js');

App({
  globalData: {
    // role 字段原型阶段保留作为历史兼容，V1.9 之后实际身份判断改用
    // mock.getMerchantApplication().status，不再单独维护这个字段
    role: 'resident',

    isBound: true,

    mockUser: {
      nickName: '体验用户',
      avatarUrl: '',
      residentId: 'U10001',
      merchantId: 'M2001',
      merchantName: '张师傅废品回收站'
    }
  },

  onLaunch() {
    console.log('【小程序启动】资源回收原型 onLaunch');

    // 真实项目：
    //   wx.login() 拿到 code -> 后端换 openid -> 查 users/merchants 表
    // 原型阶段：直接读 mock 里的审核状态
    const application = mock.getMerchantApplication();
    console.log('【身份判定】当前商户审核状态：', application.status);

    if (application.status === 'approved') {
      // 已是审核通过的商户：不需要用户手动切换，直接拉进商户工作台，体验更"丝滑"
      wx.reLaunch({ url: '/pages/merchant/index/index' });
    }
    // 其他状态（none / pending）：什么都不做，自然停留在 app.json 里配置的默认首页（用户端首页）
  }
});
