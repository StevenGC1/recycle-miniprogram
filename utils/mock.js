// utils/mock.js —— V1.9
// ============================================================
// Mock（假）数据文件
// ------------------------------------------------------------
// 原型阶段不连接任何后端/云数据库，所有"看起来像数据库查出来的"数据
// 全部写死在这个文件里，用模块内的变量当"内存数据库"，
// 增删改查动作直接修改这些变量，模拟"写库"效果（重启小程序会恢复初始状态，这是正常的）。
//
// V1.9 新增板块：
//   - 商户审核状态（对应"商户怎么注册/谁是谁"）
//   - 商户货架商品（二手商品发布，是用户端商城的数据源）
//   - 商户数据看板
//   - 商户自定义报价（可编辑，影响居民端展示的价格）
//   - 订单按三态分类（待上门/已完成/已取消）
// ============================================================

// ---------- 1. 订单数据 ----------
// 订单状态枚举说明：
//   'wait'      -> 待接单（商户还没人抢）
//   'accepted'  -> 待上门（商户已接单，尚未完成）
//   'done'      -> 已完成
//   'cancelled' -> 已取消（居民取消或商户取消）
const ORDER_LIST = [
  {
    orderId: 'O20260627001',
    status: 'wait',
    community: '阳光花园小区',
    fullAddress: '阳光花园小区 3 号楼 2 单元 502 室',
    contactPhone: '138****1234',
    fullPhone: '13800001234',
    appointmentTime: '今天 下午 14:00-16:00',
    remark: '家里有些旧纸箱和废铁',
    photoUrl: '',
    createTime: '2026-06-27 09:12',
    merchantId: '',
    merchantName: ''
  },
  {
    orderId: 'O20260627002',
    status: 'accepted',
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
    status: 'done',
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
    weight: 50,
    pointsEarned: 50,
    is_commented: true,   // 这条已经评价过，方便你直接在商户端看到"回显评价"的效果
    rating: 5,
    commentTags: []
  },
  {
    // V1.9 新增一条"已取消"订单，用于商户端【已取消】Tab 演示
    orderId: 'O20260624004',
    status: 'cancelled',
    community: '龙湖花园',
    fullAddress: '龙湖花园 5 号楼 1201 室',
    contactPhone: '136****3456',
    fullPhone: '13600003456',
    appointmentTime: '6月24日 上午 10:00-12:00',
    remark: '',
    photoUrl: '',
    createTime: '2026-06-23 18:00',
    merchantId: 'M2001',
    merchantName: '张师傅废品回收站',
    cancelReason: '居民临时有事，主动取消'
  }
];

// ---------- 2. 商户信息 ----------
const MERCHANT_PROFILE = {
  merchantId: 'M2001',
  merchantName: '张师傅废品回收站',
  avatar: '',
  serviceYears: 5,
  totalOrders: 1280,
  promotionCode: 'M2001-PROMO-CODE',
  boundResidentCount: 86
};

// ---------- 2.1 V1.9 新增：商户审核状态（对应"商户怎么注册/如何判定身份"） ----------
// status 取值：
//   'none'     -> 这个微信用户从没申请过商户
//   'pending'  -> 已提交入驻申请，等待人工审核
//   'approved' -> 审核通过，是正式商户，小程序启动应自动进商户端工作台
const MERCHANT_APPLICATION = {
  // 原型阶段默认 'none'（默认体验用户端），在"我的"页面点击
  // 【强制切换为已审核商户】按钮后会变成 'approved'，下次启动小程序就会自动进商户工作台
  status: 'none',
  shopName: '',
  phone: '',
  serviceArea: ''
};

// ---------- 2.2 V1.9 新增：商户数据看板 ----------
const MERCHANT_DASHBOARD = {
  points: 1280,        // 商户积分（未来用于抢单扣点）
  todayOrderCount: 3,  // 今日成单数
  todayWeight: 86       // 今日回收总量（斤）
};

// ---------- 2.3 V1.9 新增：商户货架（二手商品发布，是用户端商城的数据源） ----------
// status 取值：'on_sale'(在售) / 'sold'(已售) / 'off_shelf'(已下架)
const SHOP_ITEM_LIST = [
  {
    itemId: 'P001',
    merchantId: 'M2001',
    name: '二手自行车（八成新）',
    price: '120',
    stock: 1,
    photoList: [],
    status: 'on_sale',
    desc: '自提或下次上门回收时顺路配送'
  },
  {
    itemId: 'P002',
    merchantId: 'M2001',
    name: '二手电风扇',
    price: '30',
    stock: 1,
    photoList: [],
    status: 'on_sale',
    desc: '自提或下次上门回收时顺路配送'
  },
  {
    itemId: 'P003',
    merchantId: 'M2001',
    name: '闲置餐具套装',
    price: '15',
    stock: 1,
    photoList: [],
    status: 'sold', // 演示"已售"状态
    desc: '自提或下次上门回收时顺路配送'
  }
];

// ---------- 3. 我的页面 - 当前居民信息 ----------
const RESIDENT_PROFILE = {
  nickName: '体验用户',
  myAddress: '阳光花园小区 3 号楼 2 单元 502 室',
  myPoints: 230,
  boundMerchant: '张师傅废品回收站'
};

// ---------- 5. 今日回收价（首页板块用） ----------
// V1.9 改动：商家自定义价格变成"可被商户中心修改的可变对象"，不再是写死常量，
// 这样商户在【自定义报价】里改了价格，居民端首页/价格详情页能立刻看到联动效果。
let MERCHANT_PRICE_LIST = [
  { name: '黄板纸', price: '0.9' },
  { name: '废铁', price: '1.2' },
  { name: '废铝', price: '6.5' },
  { name: '塑料瓶', price: '1.0' },
  { name: '旧衣物', price: '0.3' },
  { name: '废旧家电', price: '面议' }
];

const CITY_AVG_PRICE_LIST = [
  { name: '黄板纸', price: '0.8' },
  { name: '废铁', price: '1.1' },
  { name: '废铝', price: '6.0' },
  { name: '塑料瓶', price: '0.9' },
  { name: '旧衣物', price: '0.2' },
  { name: '废旧家电', price: '面议' }
];

// ---------- 7. 价格详情页 - 分类价格表 ----------
// 同样改成"可变"，商户中心改报价时一并联动这份分类数据（保持两处数据来源一致）
let MERCHANT_PRICE_CATEGORY_LIST = [
  { category: '纸皮类', items: [
    { name: '黄纸', price: '1.70' },
    { name: '花纸', price: '1.30' },
    { name: '统纸', price: '1.60' },
    { name: '书籍', price: '1.30' }
  ]},
  { category: '金属类', items: [
    { name: '铝制品', price: '6.50' },
    { name: '厚铁', price: '2.40' },
    { name: '薄铁', price: '2.00' },
    { name: '不锈钢', price: '2.40' },
    { name: '铜', price: '49.00' }
  ]},
  { category: '塑料类', items: [
    { name: '塑料瓶-透明', price: '1.30' },
    { name: '杂料瓶', price: '0.90' }
  ]},
  { category: '家电类', items: [
    { name: '旧家电', price: '面议' }
  ]},
  { category: '衣物类', items: [
    { name: '旧衣物', price: '0.30' }
  ]}
];

const CITY_AVG_PRICE_CATEGORY_LIST = [
  { category: '纸皮类', items: [
    { name: '黄纸', price: '1.60' },
    { name: '花纸', price: '1.20' },
    { name: '统纸', price: '1.50' },
    { name: '书籍', price: '1.20' }
  ]},
  { category: '金属类', items: [
    { name: '铝制品', price: '6.00' },
    { name: '厚铁', price: '2.20' },
    { name: '薄铁', price: '1.80' },
    { name: '不锈钢', price: '2.20' },
    { name: '铜', price: '48.00' }
  ]},
  { category: '塑料类', items: [
    { name: '塑料瓶-透明', price: '1.20' },
    { name: '杂料瓶', price: '0.80' }
  ]},
  { category: '家电类', items: [
    { name: '旧家电', price: '面议' }
  ]},
  { category: '衣物类', items: [
    { name: '旧衣物', price: '0.20' }
  ]}
];

// ---------- 8. 模拟"逆地理编码"：根据坐标返回城市/区名 ----------
const CITY_BOUNDS = [
  { name: '深圳市南山区', latMin: 22.45, latMax: 22.60, lngMin: 113.85, lngMax: 114.05 },
  { name: '深圳市福田区', latMin: 22.50, latMax: 22.56, lngMin: 114.02, lngMax: 114.12 },
  { name: '广州市天河区', latMin: 23.08, latMax: 23.20, lngMin: 113.30, lngMax: 113.40 },
  { name: '北京市朝阳区', latMin: 39.85, latMax: 40.10, lngMin: 116.40, lngMax: 116.55 },
  { name: '上海市浦东新区', latMin: 31.15, latMax: 31.35, lngMin: 121.45, lngMax: 121.70 }
];

function mockReverseGeocode(latitude, longitude) {
  const matched = CITY_BOUNDS.find(c =>
    latitude >= c.latMin && latitude <= c.latMax &&
    longitude >= c.lngMin && longitude <= c.lngMax
  );
  const cityName = matched ? matched.name : '深圳市南山区';
  console.log('【模拟逆地理编码】坐标：', latitude, longitude, '-> 判断为：', cityName);
  return cityName;
}

// ============================================================
// 以下是对外暴露的"接口函数"
// ============================================================

function getOrderList() {
  return ORDER_LIST;
}

function getMerchantProfile() {
  return MERCHANT_PROFILE;
}

function getResidentProfile() {
  return RESIDENT_PROFILE;
}

// V1.9 新增：查询当前用户的商户审核状态（对应"判定谁是谁"）
function getMerchantApplication() {
  // 真实接口： GET /api/merchant/application?openid=xxx
  return MERCHANT_APPLICATION;
}

// V1.9 新增：提交商户入驻申请，状态置为 pending
function submitMerchantApplication(shopName, phone, serviceArea) {
  // 真实接口： POST /api/merchant/apply { shopName, phone, serviceArea }
  MERCHANT_APPLICATION.status = 'pending';
  MERCHANT_APPLICATION.shopName = shopName;
  MERCHANT_APPLICATION.phone = phone;
  MERCHANT_APPLICATION.serviceArea = serviceArea;
  return MERCHANT_APPLICATION;
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
    }));
}

// V1.9 改动：按"待上门/已完成/已取消"三态分别查询商户任务列表
// subTab 取值：'accepted' / 'done' / 'cancelled'
function getMerchantTaskList(merchantId, subTab) {
  return ORDER_LIST.filter(o => o.merchantId === merchantId && o.status === subTab);
}

function getTodayPriceList(hasBoundMerchant, cityName) {
  if (hasBoundMerchant) {
    return { sourceText: '专属商家价格', list: MERCHANT_PRICE_LIST };
  }
  const sourceText = cityName ? `${cityName} · 平台参考价` : '本市平台参考价';
  return { sourceText, list: CITY_AVG_PRICE_LIST };
}

function getPriceCategoryList(hasBoundMerchant, cityName) {
  if (hasBoundMerchant) {
    return { sourceText: '专属商家价格 · 张师傅废品回收站', list: MERCHANT_PRICE_CATEGORY_LIST };
  }
  const sourceText = cityName ? `${cityName} · 回收价格明细表` : '本市平台参考价';
  return { sourceText, list: CITY_AVG_PRICE_CATEGORY_LIST };
}

// V1.9 新增：商户修改某个分类下某个品类的报价，同步更新"分类详情页"和"首页精选价目"两份数据
// 真实接口： POST /api/merchant/price/update { category, name, price }
function updateMerchantPrice(category, name, newPrice) {
  // 更新分类详情页数据
  const cat = MERCHANT_PRICE_CATEGORY_LIST.find(c => c.category === category);
  if (cat) {
    const item = cat.items.find(i => i.name === name);
    if (item) item.price = newPrice;
  }
  // 同步更新首页精选价目（如果该品类也在首页精选列表里）
  const homeItem = MERCHANT_PRICE_LIST.find(i => i.name === name);
  if (homeItem) homeItem.price = newPrice;
}

// 获取二手商城商品列表（用户端"同城二手车间"用，仅展示在售商品）
function getMallItemList() {
  return SHOP_ITEM_LIST.filter(item => item.status === 'on_sale');
}

// V1.9 新增：商户货架完整列表（商户端"商户货架"页用，在售+已售都展示）
function getShopItemList(merchantId) {
  return SHOP_ITEM_LIST.filter(item => item.merchantId === merchantId);
}

// V1.9 新增：发布二手商品
function addShopItem(merchantId, name, price, stock, photoList) {
  const newItem = {
    itemId: 'P' + Date.now(),
    merchantId,
    name,
    price,
    stock: stock || 1,
    photoList: photoList || [],
    status: 'on_sale',
    desc: '自提或下次上门回收时顺路配送'
  };
  SHOP_ITEM_LIST.unshift(newItem);
  return newItem;
}

// V1.9 新增：下架 / 标记已售
function updateShopItemStatus(itemId, newStatus) {
  const item = SHOP_ITEM_LIST.find(i => i.itemId === itemId);
  if (item) item.status = newStatus;
  return item;
}

// V1.9 新增：商户数据看板
function getMerchantDashboard() {
  return MERCHANT_DASHBOARD;
}

function submitOrderComment(orderId, rating, tags) {
  const order = ORDER_LIST.find(o => o.orderId === orderId);
  if (order) {
    order.is_commented = true;
    order.rating = rating;
    order.commentTags = tags;
  }
  return order;
}

// V1.9 新增：商户"称重结算"完成订单（原 onConfirmDone 的逻辑搬到 mock 层，方便复用）
function settleOrder(orderId, weight) {
  const order = ORDER_LIST.find(o => o.orderId === orderId);
  if (order) {
    order.status = 'done';
    order.weight = weight;
    order.pointsEarned = weight;
    order.is_commented = false;
    order.rating = 0;
  }
  return order;
}

module.exports = {
  getOrderList,
  getMerchantProfile,
  getResidentProfile,
  getHallOrderList,
  getMerchantTaskList,
  getTodayPriceList,
  getMallItemList,
  getPriceCategoryList,
  submitOrderComment,
  mockReverseGeocode,
  // V1.9 新增导出
  getMerchantApplication,
  submitMerchantApplication,
  getMerchantDashboard,
  getShopItemList,
  addShopItem,
  updateShopItemStatus,
  updateMerchantPrice,
  settleOrder
};
