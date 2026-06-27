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

// ---------- 5. 今日回收价（首页"今日回收价"板块用） ----------
// 设计对应 PRD：
//   若用户已绑定专属商家(parent_merchant_id) -> 优先展示该商家自定义价格
//   若未绑定 -> 展示当前城市的平台参考均价
// 原型阶段没有"城市定位识别"，直接用两套写死的数组模拟这两种情况。

// 商家自定义价格（张师傅的价格表，比平台均价略高，体现"专属商家更划算"的私域价值）
const MERCHANT_PRICE_LIST = [
  { name: '黄板纸', price: '0.9' },
  { name: '废铁', price: '1.2' },
  { name: '废铝', price: '6.5' },
  { name: '塑料瓶', price: '1.0' },
  { name: '旧衣物', price: '0.3' },
  { name: '废旧家电', price: '面议' }
];

// 平台城市参考均价（用户没有绑定专属商家时展示）
const CITY_AVG_PRICE_LIST = [
  { name: '黄板纸', price: '0.8' },
  { name: '废铁', price: '1.1' },
  { name: '废铝', price: '6.0' },
  { name: '塑料瓶', price: '0.9' },
  { name: '旧衣物', price: '0.2' },
  { name: '废旧家电', price: '面议' }
];

// ---------- 6. 二手/积分商城 - 商品列表 ----------
// 对应 PRD："仅拉取并展示该绑定回收站(商家)上架的二手闲置物品"
// 原型阶段写死 3 件"张师傅"上架的二手物品。
const MALL_ITEM_LIST = [
  {
    itemId: 'P001',
    name: '二手自行车（八成新）',
    price: '120元 或 800积分',
    merchantName: '张师傅废品回收站',
    desc: '自提或下次上门回收时顺路配送'
  },
  {
    itemId: 'P002',
    name: '二手电风扇',
    price: '30元 或 200积分',
    merchantName: '张师傅废品回收站',
    desc: '自提或下次上门回收时顺路配送'
  },
  {
    itemId: 'P003',
    name: '闲置餐具套装',
    price: '15元 或 100积分',
    merchantName: '张师傅废品回收站',
    desc: '自提或下次上门回收时顺路配送'
  }
];

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

// 获取今日回收价：根据是否绑定专属商家，返回不同价目表 + 来源文案
// hasBoundMerchant: true 时模拟"已绑定专属商家"场景
function getTodayPriceList(hasBoundMerchant) {
  // 真实接口： GET /api/price/today?cityId=xxx&merchantId=xxx
  if (hasBoundMerchant) {
    return { sourceText: '专属商家价格', list: MERCHANT_PRICE_LIST };
  }
  return { sourceText: '本市平台参考价', list: CITY_AVG_PRICE_LIST };
}

// 获取二手商城商品列表（同城二手车间Tab，仅展示绑定商家上架的物品）
function getMallItemList() {
  // 真实接口： GET /api/mall/items?merchantId=xxx
  return MALL_ITEM_LIST;
}

module.exports = {
  getOrderList,
  getMerchantProfile,
  getResidentProfile,
  getHallOrderList,
  getMerchantTaskList,
  getTodayPriceList,
  getMallItemList
};
