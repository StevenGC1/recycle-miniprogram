// utils/mock.js
// ============================================================
// Mock（假）数据文件
// ------------------------------------------------------------
// 原型阶段不连接任何后端接口，所有"看起来像数据库查出来的"数据
// 全部写死在这个文件里。
//
// 设计意图：以后接后端时，只需要把页面里
//   const mock = require('../../utils/mock.js')
//   mock.getOrderList()
// 替换成
//   wx.request({ url: '真实后端地址/order/list', ... })
// 函数名和返回的数据结构尽量保持不变，这样页面的渲染逻辑（wxml）不用大改。
// ============================================================

// ---------- 1. 订单数据 ----------
// 订单状态枚举说明：
//   'wait'     -> 待接单（商户还没人抢，居民端显示"等待商家接单"）
//   'accepted' -> 待上门（商户已接单，居民端显示"师傅即将上门"）
//   'done'     -> 已完成
const ORDER_LIST = [
  {
    orderId: 'O20260627001',
    status: 'wait', // 待接单
    community: '阳光花园小区', // 商户端只显示小区名，不显示门牌号（隐私保护）
    fullAddress: '阳光花园小区 3 号楼 2 单元 502 室', // 商户接单后才显示完整地址
    contactPhone: '138****1234',
    fullPhone: '13800001234', // 商户接单后才显示真实号码
    appointmentTime: '今天 下午 14:00-16:00',
    remark: '家里有些旧纸箱和废铁',
    photoUrl: '', // 拍照下单时上传的图片，原型阶段留空
    createTime: '2026-06-27 09:12',
    merchantId: '', // 还没有人接单
    merchantName: ''
  },
  {
    orderId: 'O20260627002',
    status: 'accepted', // 待上门
    community: '幸福里小区',
    fullAddress: '幸福里小区 8 号楼 1 单元 101 室',
    contactPhone: '139****5678',
    fullPhone: '13900005678',
    appointmentTime: '今天 上午 09:00-11:00',
    remark: '',
    photoUrl: '',
    createTime: '2026-06-26 20:30',
    merchantId: 'M2001',
    merchantName: '张师傅废品回收站'
  },
  {
    orderId: 'O20260626003',
    status: 'done', // 已完成
    community: '碧水蓝天小区',
    fullAddress: '碧水蓝天小区 12 号楼 3 单元 1203 室',
    contactPhone: '137****9012',
    fullPhone: '13700009012',
    appointmentTime: '昨天 下午 16:00-18:00',
    remark: '旧家电较多，需要带电梯工具',
    photoUrl: '',
    createTime: '2026-06-25 14:00',
    merchantId: 'M2001',
    merchantName: '张师傅废品回收站',
    // 已完成订单才有的字段：本次回收重量和获得积分（对应"记账与积分"留存策略）
    weight: 50, // 斤
    pointsEarned: 50
  }
];

// ---------- 2. 商户信息（扫码进入"熟客刷脸"页面时用） ----------
const MERCHANT_PROFILE = {
  merchantId: 'M2001',
  merchantName: '张师傅废品回收站',
  avatar: '', // 头像图片，原型阶段留空用文字代替
  serviceYears: 5,
  totalOrders: 1280,
  promotionCode: 'M2001-PROMO-CODE', // 专属推广码内容（生成二维码时用这个字符串）
  boundResidentCount: 86 // 已绑定的居民客户数
};

// ---------- 3. 我的页面 - 当前居民信息 ----------
const RESIDENT_PROFILE = {
  nickName: '体验用户',
  myAddress: '阳光花园小区 3 号楼 2 单元 502 室',
  myPoints: 230, // 累计积分
  boundMerchant: '张师傅废品回收站' // 当前绑定的"熟客"商户，体现"熟客刷脸"机制
};

// ---------- 4. 工具函数：模拟"接口请求"，统一在这里返回数据 ----------
// 之所以包一层函数而不是直接 module.exports = { ORDER_LIST },
// 是为了让调用方式更接近"请求接口"，以后替换成真实请求时改动最小。

function getOrderList() {
  // 真实接口： GET /api/order/list
  return ORDER_LIST;
}

function getMerchantProfile() {
  // 真实接口： GET /api/merchant/profile?id=xxx
  return MERCHANT_PROFILE;
}

function getResidentProfile() {
  // 真实接口： GET /api/resident/profile
  return RESIDENT_PROFILE;
}

// 商户端"接单大厅"看到的订单池：只展示状态为 wait 的订单，且字段做了隐私脱敏
function getHallOrderList() {
  return ORDER_LIST
    .filter(o => o.status === 'wait')
    .map(o => ({
      orderId: o.orderId,
      community: o.community,
      appointmentTime: o.appointmentTime,
      remark: o.remark,
      createTime: o.createTime
      // 注意：这里故意不返回 fullAddress / fullPhone，
      // 对应方案里"隐藏手机号和详细门牌号"的隐私保护设计
    }));
}

// 商户端"我的任务"看到的订单：状态为 accepted 或 done，且是自己接的单
function getMerchantTaskList(merchantId) {
  return ORDER_LIST.filter(
    o => o.merchantId === merchantId && (o.status === 'accepted' || o.status === 'done')
  );
}

module.exports = {
  getOrderList,
  getMerchantProfile,
  getResidentProfile,
  getHallOrderList,
  getMerchantTaskList
};
