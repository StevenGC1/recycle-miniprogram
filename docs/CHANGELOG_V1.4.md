# 更新日志 —— v1.4（PRD V2.3：申请页完善 + 投诉建议防刷 + 隐藏管理后台 + 三端任意门）

## 一、申请入驻页完善（`pages/merchantApply`）
- 新增字段：负责人姓名、联系电话【一键导入微信手机号】按钮（`open-type="getPhoneNumber"`，模拟器/未认证小程序点击会提示"请手动输入"，真机+已认证小程序才能真正拿到授权回调）
- 网点坐标：点击调用 `wx.chooseLocation`，选定后回显地名
- 车辆/网点照片：1张，支持删除重拍
- 防重复提交：`isSubmitting` 锁，点击后按钮变灰+文案变"提交中..."，800ms模拟提交耗时后跳转结果页
- 提交成功用 `wx.redirectTo`（不是 `navigateTo`）跳到新增的 **`pages/applyResult`** 结果页，因为 redirectTo 会关闭当前表单页，用户无法点返回键回到表单重复填写
- `pages/applyResult`：根据审核状态（pending/approved/rejected）展示三种不同视图，被驳回时显示驳回原因+可重新提交

## 二、投诉与建议（`pages/mine`）
- "我的"页新增【💬 投诉与建议】入口，弹窗 + 200字限制 `textarea`
- **本地缓存防刷**：提交成功后 `wx.setStorageSync('last_complaint_date', 今天)`，再次点击入口时先比对缓存日期，今天已提交过直接 `showToast` 拦截，不打开弹窗、不触发任何提交逻辑

## 三、隐藏管理后台（`pages/admin/index`）
单页内用顶部Tab切换4个面板（没有做成4个独立路由页面，减少你来回跳转的成本，电脑端/开发者工具全屏操作体验更好）：

1. **用户管理**：手机号/昵称搜索，卡片展示成单数/取消数（取消数标红），【封禁】/【解禁】
2. **商户管理与审批**：
   - 子页签[入驻审批大厅]：列出所有 `pending` 申请，展示店铺名/负责人/坐标/提交时间，可查看照片，【准予入驻】（自动开通商户权限）/【驳回申请】（弹窗填驳回原因）
   - 子页签[全城商户大盘]：按积分/今日成单量/好评率三种排序，好评率低于4.0星的卡片标红，可【拉黑该商户】
3. **二手货架提单审核**：商户发布的商品现在默认是"待审核"状态（不会直接出现在用户端商城），后台【允许上架】才会变成"在售"，或【拒绝上架】
4. **投诉建议大厅**：展示投诉人手机号/时间/内容，【拨打电话核实】+【标记为已处理】（处理后卡片变淡）

## 四、三端任意门（"我的"页面底部）
- 👤 普通居民（当前就在居民端，仅提示）
- 🚲 回收小哥：强制把审核状态设为 approved，`reLaunch` 进商户工作台
- 🖥 平台总裁：直接 `navigateTo` 进隐藏管理后台

## 数据层改动（`utils/mock.js`）
- `MERCHANT_APPLICATION`（单对象）→ `MERCHANT_APPLICATION_LIST`（列表，含"me"+2个虚构申请人，方便后台审批大厅有数据可看）
- 新增 `USER_LIST`、`MERCHANT_BOARD_LIST`、`SUGGESTION_LIST`
- `SHOP_ITEM_LIST` 新增 `pending_review`/`rejected` 状态，`addShopItem` 默认状态改为待审核
- 新增导出：`getPendingApplications`/`approveApplication`/`rejectApplication`/`getUserList`/`banUser`/`unbanUser`/`getMerchantBoardList`/`blacklistMerchant`/`getPendingShopItems`/`approveShopItem`/`rejectShopItem`/`getSuggestionList`/`submitSuggestion`/`markSuggestionHandled`

```bash
git add .
git commit -m "feat(v1.4): 申请入驻页完善(防重复提交+独立结果页)/投诉建议本地防刷/隐藏管理后台四大面板/三端任意门"
git tag -a v1.4 -m "申请页完善+投诉建议防刷+隐藏管理后台+三端任意门"
```

## 已知简化点

- 后台所有操作都是改内存数据，重启小程序会恢复初始状态（比如已封禁的用户会变回正常），这是原型阶段的正常现象。
- "拉黑商户"只是把状态改成 `blacklisted` 做展示，没有真的去影响该商户在商户端的接单权限（这需要在商户端登录校验时读取这个状态，等接后端时一起做）。
- 一键导入微信手机号在模拟器/未认证小程序里拿不到真实号码，这是微信官方接口的限制，不是代码bug。
