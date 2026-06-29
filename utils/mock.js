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
//   'rejected' -> 被驳回
// （V2.3：单条 MERCHANT_APPLICATION 对象已被下方的 MERCHANT_APPLICATION_LIST 取代，
//  统一用列表结构，方便管理后台同时展示多个申请人）

// V2.3 新增：管理后台用的"全量入驻申请列表"，包含别的（虚构）申请人，
// 方便你在后台体验"审批大厅"列表效果，不只是你自己这一条。
// applicantId: 'me' 代表"当前体验用户"自己提交的申请，方便表单页和后台共用同一条数据。
const MERCHANT_APPLICATION_LIST = [
  {
    applicantId: 'me',
    shopName: '',
    contactName: '',
    phone: '',
    serviceArea: '',
    locationName: '',
    latitude: null,
    longitude: null,
    photoPath: '',
    status: 'none',
    rejectReason: '',
    submitTime: ''
  },
  {
    applicantId: 'A001',
    shopName: '李姐回收点',
    contactName: '李姐',
    phone: '13900112233',
    serviceArea: '深圳市福田区',
    locationName: '福田区上沙村东门',
    latitude: 22.535,
    longitude: 114.06,
    photoPath: '',
    status: 'pending',
    rejectReason: '',
    submitTime: '2026-06-28 16:20'
  },
  {
    applicantId: 'A002',
    shopName: '老王废品收购站',
    contactName: '王建国',
    phone: '13700556677',
    serviceArea: '深圳市南山区',
    locationName: '南山区西丽街道',
    latitude: 22.57,
    longitude: 113.95,
    photoPath: '',
    status: 'pending',
    rejectReason: '',
    submitTime: '2026-06-29 09:05'
  }
];

// ---------- 2.2 V1.9 新增：商户数据看板 ----------
const MERCHANT_DASHBOARD = {
  points: 1280,
  todayOrderCount: 3,
  todayWeight: 86
};

// ---------- 2.3 V1.9 新增：商户货架（二手商品发布） ----------
// status 取值：'pending_review'(待审核) / 'on_sale'(在售) / 'sold'(已售) / 'off_shelf'(已下架) / 'rejected'(已驳回)
// V2.3 改动：新发布的商品默认是"待审核"，要在管理后台"二手货架提单审核"通过后才会变成"在售"
const SHOP_ITEM_LIST = [
  {
    itemId: 'P001',
    merchantId: 'M2001',
    merchantName: '张师傅废品回收站',
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
    merchantName: '张师傅废品回收站',
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
    merchantName: '张师傅废品回收站',
    name: '闲置餐具套装',
    price: '15',
    stock: 1,
    photoList: [],
    status: 'sold',
    desc: '自提或下次上门回收时顺路配送'
  },
  {
    // V2.3 新增一条"待审核"的商品，方便你在后台直接看到审核大厅的效果
    itemId: 'P004',
    merchantId: 'M2001',
    merchantName: '张师傅废品回收站',
    name: '九成新山地车',
    price: '300',
    stock: 1,
    photoList: [],
    status: 'pending_review',
    desc: '自提或下次上门回收时顺路配送'
  }
];

// ---------- 2.4 V2.3 新增：用户管理（管理后台用） ----------
// status 取值：'normal'(正常) / 'banned'(已封禁)
const USER_LIST = [
  { userId: 'U10001', nickName: '体验用户', phone: '13800001234', completedOrders: 5, cancelledOrders: 0, status: 'normal' },
  { userId: 'U10002', nickName: '爱占小便宜的小李', phone: '13911112222', completedOrders: 1, cancelledOrders: 6, status: 'normal' },
  { userId: 'U10003', nickName: '老实巴交的张大爷', phone: '13722223333', completedOrders: 20, cancelledOrders: 1, status: 'normal' },
  { userId: 'U10004', nickName: '恶意刷单用户', phone: '13633334444', completedOrders: 0, cancelledOrders: 12, status: 'banned' }
];

// ---------- 2.5 V2.3 新增：全城商户大盘（管理后台用） ----------
const MERCHANT_BOARD_LIST = [
  { merchantId: 'M2001', merchantName: '张师傅废品回收站', points: 1280, todayOrderCount: 3, ratingAvg: 4.8, status: 'normal' },
  { merchantId: 'M2002', merchantName: '李姐回收点', points: 860, todayOrderCount: 5, ratingAvg: 3.6, status: 'normal' },
  { merchantId: 'M2003', merchantName: '老王废品收购站', points: 430, todayOrderCount: 1, ratingAvg: 3.9, status: 'normal' },
  { merchantId: 'M2004', merchantName: '问题商户·快跑回收', points: 90, todayOrderCount: 0, ratingAvg: 2.1, status: 'normal' } // 低评分，用于演示"标红+拉黑"
];

// ---------- 2.6 V2.3 新增：投诉建议（管理后台用） ----------
const SUGGESTION_LIST = [
  {
    id: 'S001',
    phone: '13800001234',
    content: '老张回收不给够斤两，少给了我3斤！',
    time: '2026-06-28 19:30',
    handled: false
  },
  {
    id: 'S002',
    phone: '13911112222',
    content: '希望可以增加预约提醒功能，老是忘记上门时间',
    time: '2026-06-27 10:12',
    handled: true
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

// V1.9 新增：查询当前用户(applicantId='me')的商户审核状态（对应"判定谁是谁"）
function getMerchantApplication() {
  // 真实接口： GET /api/merchant/application?openid=xxx
  return MERCHANT_APPLICATION_LIST.find(a => a.applicantId === 'me');
}

// V2.3 改动：提交申请时记录完整资料（负责人姓名/地图坐标/照片），状态置为 pending
function submitMerchantApplication(formData) {
  // 真实接口： POST /api/merchant/apply { shopName, contactName, phone, serviceArea, latitude, longitude, photoPath }
  const me = MERCHANT_APPLICATION_LIST.find(a => a.applicantId === 'me');
  Object.assign(me, formData, {
    status: 'pending',
    submitTime: new Date().toLocaleString()
  });
  return me;
}

// V2.3 新增：管理后台 - 入驻审批大厅，列出所有 pending 状态的申请
function getPendingApplications() {
  return MERCHANT_APPLICATION_LIST.filter(a => a.status === 'pending');
}

// V2.3 新增：管理后台 - 准予入驻（自动开通商户端权限）
function approveApplication(applicantId) {
  const app = MERCHANT_APPLICATION_LIST.find(a => a.applicantId === applicantId);
  if (app) app.status = 'approved';
  return app;
}

// V2.3 新增：管理后台 - 驳回申请（需填写原因）
function rejectApplication(applicantId, reason) {
  const app = MERCHANT_APPLICATION_LIST.find(a => a.applicantId === applicantId);
  if (app) {
    app.status = 'rejected';
    app.rejectReason = reason;
  }
  return app;
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
// V2.3 改动：新发布商品默认 'pending_review'，需要管理后台审核通过才会出现在用户端商城
function addShopItem(merchantId, merchantName, name, price, stock, photoList) {
  const newItem = {
    itemId: 'P' + Date.now(),
    merchantId,
    merchantName,
    name,
    price,
    stock: stock || 1,
    photoList: photoList || [],
    status: 'pending_review',
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

// ============================================================
// V2.3 新增：隐藏管理后台 - 四大模块函数
// ============================================================

// ---- 模块1：用户管理 ----
function getUserList(keyword) {
  // 真实接口： GET /api/admin/users?keyword=xxx
  if (!keyword) return USER_LIST;
  return USER_LIST.filter(u => u.phone.indexOf(keyword) > -1 || u.nickName.indexOf(keyword) > -1);
}

function banUser(userId) {
  const user = USER_LIST.find(u => u.userId === userId);
  if (user) user.status = 'banned';
  return user;
}

function unbanUser(userId) {
  const user = USER_LIST.find(u => u.userId === userId);
  if (user) user.status = 'normal';
  return user;
}

// ---- 模块2：商户管理与审批（入驻审批大厅 在上方 getPendingApplications/approveApplication/rejectApplication）----
// 全城商户大盘：sortBy 取值 'points' / 'todayOrderCount' / 'ratingAvg'
function getMerchantBoardList(sortBy) {
  const list = MERCHANT_BOARD_LIST.slice(); // 拷贝一份再排序，不修改原始顺序
  if (sortBy) {
    list.sort((a, b) => b[sortBy] - a[sortBy]);
  }
  return list;
}

function blacklistMerchant(merchantId) {
  const m = MERCHANT_BOARD_LIST.find(m => m.merchantId === merchantId);
  if (m) m.status = 'blacklisted';
  return m;
}

// ---- 模块3：二手货架提单审核 ----
function getPendingShopItems() {
  return SHOP_ITEM_LIST.filter(item => item.status === 'pending_review');
}

function approveShopItem(itemId) {
  const item = SHOP_ITEM_LIST.find(i => i.itemId === itemId);
  if (item) item.status = 'on_sale';
  return item;
}

function rejectShopItem(itemId) {
  const item = SHOP_ITEM_LIST.find(i => i.itemId === itemId);
  if (item) item.status = 'rejected';
  return item;
}

// ---- 模块4：投诉建议大厅 ----
function getSuggestionList() {
  return SUGGESTION_LIST;
}

function submitSuggestion(phone, content) {
  // 真实接口： POST /api/suggestion/submit { phone, content }
  const newItem = {
    id: 'S' + Date.now(),
    phone,
    content,
    time: new Date().toLocaleString(),
    handled: false
  };
  SUGGESTION_LIST.unshift(newItem);
  return newItem;
}

function markSuggestionHandled(id) {
  const item = SUGGESTION_LIST.find(s => s.id === id);
  if (item) item.handled = true;
  return item;
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
  getMerchantApplication,
  submitMerchantApplication,
  getMerchantDashboard,
  getShopItemList,
  addShopItem,
  updateShopItemStatus,
  updateMerchantPrice,
  settleOrder,
  // V2.3 新增导出：管理后台四大模块
  getPendingApplications,
  approveApplication,
  rejectApplication,
  getUserList,
  banUser,
  unbanUser,
  getMerchantBoardList,
  blacklistMerchant,
  getPendingShopItems,
  approveShopItem,
  rejectShopItem,
  getSuggestionList,
  submitSuggestion,
  markSuggestionHandled
};
