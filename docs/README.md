# 资源回收小程序 —— 前端原型说明文档

本项目是「资源回收类微信小程序」的**前端交互原型**。
目标：不连接任何后端，全部使用写死的假数据（Mock），让你能完整点一遍流程，
判断"一键下单是否够简单"、"商户抢单是否够爽"，再决定要不要往下做后端。

---

## 一、目录结构与文件说明

```
recycle-miniprogram/
├── app.js                  小程序入口逻辑：初始化全局角色(居民/商户)、模拟登录用户
├── app.json                小程序全局配置：页面路由表、tabBar(底部导航)
├── app.wxss                全局通用样式：按钮、卡片、标签等公共样式类
├── project.config.json     微信开发者工具的项目配置文件（appid、编译选项等）
├── sitemap.json            微信要求的标配文件，控制小程序是否被搜索收录
│
├── config/
│   └── config.js           【需要你填充的配置】客服微信号、AppID、地图Key等占位信息
│
├── utils/
│   └── mock.js             【核心】所有假数据 + 模拟接口函数，未来接后端只改这一个文件
│
└── pages/                  所有页面，每个页面4个文件：.js(逻辑) .json(配置) .wxml(结构) .wxss(样式)
    ├── index/index         【用户端】首页 - 极简下单（地址/时间/备注拍照/立即预约/一键呼叫）
    ├── orderList/orderList 【用户端】订单列表 - 按状态筛选(全部/待接单/待上门/已完成)，可取消
    ├── mine/mine            【用户端】我的 - 地址/积分/客服/申请入驻/测试切换商户身份
    ├── merchantApply/merchantApply  【用户端】申请入驻成为回收商
    ├── mall/mall            【用户端】二手/积分商城
    ├── familyBind/familyBind 【用户端】亲友代下
    ├── priceList/priceList   【用户端】回收价格表详情（分类展示）
    └── merchant/
        ├── index/index          【商户端】工作台 - 接单大厅 + 我的任务(待上门/已完成/已取消)
        ├── shop/shop            【商户端】商户货架 - 发布/管理二手商品
        ├── mine/mine            【商户端】商户中心 - 数据看板/地推码/自定义报价入口
        └── priceConfig/priceConfig 【商户端】自定义报价编辑页
```

> V1.9 重构说明：原来的 `merchant/hall`、`merchant/tasks`、`merchant/promotion` 已被取代，
> 现在是 `merchant/index`（工作台，合并了接单大厅+我的任务）、`merchant/shop`（商户货架）、
> `merchant/mine`（商户中心，整合了原推广中心）。
> 商户身份判定改为"审核状态自动分流"：`app.js` 的 `onLaunch` 会检查
> `utils/mock.js` 里的 `MERCHANT_APPLICATION.status`，审核通过(`approved`)会自动
> `wx.reLaunch` 进商户工作台。"我的"页面保留了一个**测试专用**的强制切换按钮，
> 方便你开发时不用每次走完整申请流程。

---

## 二、核心设计逻辑对照表（方案 -> 代码实现位置）

| 方案中的设计点 | 对应的代码位置 | 说明 |
|---|---|---|
| 一键呼叫/极简下单 | `pages/index/index.wxml` 顶部两个大按钮 | 不需要选分类、填重量 |
| 熟客刷脸 | `pages/index/index.js` 的 `boundMerchantName` 字段 | 模拟扫码进入显示专属横幅，真实场景需在 `onLoad(options)` 里解析扫码参数 |
| 亲友代下 | `pages/mine/mine.wxml` 的"亲友代下"入口 | 原型阶段只做了入口，未做具体绑定表单 |
| 隐藏隐私信息（反撬客第一步） | `utils/mock.js` 的 `getHallOrderList()` | 故意不返回 `fullAddress`/`fullPhone` 字段 |
| 记账与积分留存法 | `pages/merchant/index/index.js` 的 `onConfirmDone`/`onSubmitSettle` | 商户必须在弹窗里输入重量才能"称重结算"，同时发放积分 |
| 时间看板/路线规划（效率工具依赖） | `pages/merchant/index/index.wxml/.js` 的 `onNavigate` | 原型阶段仅做了静态展示和模拟坐标导航，真正的"看板"和"路线规划"留给后续迭代 |
| 推广码裂变 | `pages/merchant/mine/mine` | 专属推广码弹窗 + 已绑定客户数统计 |
| 商户注册与身份判定 | `pages/merchantApply` + `app.js` 的 `onLaunch` | 提交申请->`pending`，审核通过(`approved`)后启动小程序自动分流进商户工作台 |

---

## 三、Mock 数据说明（`utils/mock.js`）

写死了 **3 条假订单**，分别处于三种状态，方便你在不同页面看到不同效果：

1. `O20260627001` — 状态 `wait`（待接单）—— 在用户端订单列表显示"待接单"，
   同时会出现在**商户端接单大厅**里（脱敏后）。
2. `O20260627002` — 状态 `accepted`（待上门）—— 已被"张师傅"接单，
   会出现在**商户端我的任务**里，可以看到完整地址电话。
3. `O20260626003` — 状态 `done`（已完成）—— 已完成并发放了积分，
   在用户端订单列表会显示"本次回收 50 斤，获得积分 +50"。

所有 mock 函数都按"像接口一样"封装（如 `getOrderList()`），
**未来接后端时，只需要把这些函数内部的 `return 假数据` 换成 `wx.request` 真实请求**，
页面层（`.js`/`.wxml`）基本不用改。

---

## 四、需要你后续填充的占位信息（`config/config.js`）

| 配置项 | 当前占位值 | 说明 |
|---|---|---|
| `CUSTOMER_SERVICE_WECHAT` | `your_wechat_id_here` | 你的客服微信号 |
| `CUSTOMER_SERVICE_PHONE` | `10086` | 一键呼叫拨打的号码 |
| `WX_APPID` | `your_appid_here` | 正式申请到小程序 AppID 后填入这里，并同步改 `project.config.json` |
| `MAP_KEY` | `your_map_key_here` | 后续做真实地图路线规划时需要的腾讯/高德地图Key，目前未使用 |

---

## 五、原型阶段的"已知不完整之处"（故意简化，不是 bug）

- 取消订单、抢单、确认完成等操作只改"内存里的数组"，**刷新页面或重新进入小程序后会恢复成 mock.js 里写死的初始状态**，这是正常现象。
- 拨打电话、导航在「开发者工具模拟器」里通常会失败（已用 `fail` 回调兜底弹窗提示），真机上才能看到真实效果。
- "亲友代下""时间看板""路线规划地图"目前只有入口或占位文案，没有具体交互，留给确认 MVP 方向后再细化。
- 没有做微信登录（`wx.login`），所有"当前用户"信息来自 `app.js` 的 `globalData.mockUser`。
