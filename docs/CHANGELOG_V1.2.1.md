# 更新日志 —— v1.2.1（修复 + 自动定位城市展示价格）

## 修复

1. `app.json` 补充 `permission` 字段声明位置权限，配合 `wx.chooseLocation`/`wx.getLocation` 正确弹出授权框。
2. 真机调试 "file not found" 问题：经排查 zip 包内文件本身完整，是开发者工具真机调试缓存机制导致，详细解决步骤见 `docs/TROUBLESHOOTING.md` 问题1。

## 新增功能

**自动定位城市并展示对应区域回收价**（对应你说的"其他软件会先定位深圳南山区再展示价格"）：

- 未绑定专属商家时：首页 `onShow` 会调用 `wx.getLocation` 定位，再通过 `mock.mockReverseGeocode()` 模拟"逆地理编码"换算出城市名（原型阶段固定返回"深圳市南山区"，真实接入需要地图Key，详见 `utils/mock.js` 里的注释）
- 今日回收价板块的"来源文案"会显示成"深圳市南山区 · 平台参考价"
- 点击"查看更多"进入价格详情页时，会把已经定位到的城市名一起带过去，详情页不用重新定位，体验更连贯
- 已绑定专属商家时：不需要定位，直接显示商家自定义价格（逻辑不变）

涉及文件：`utils/mock.js`（新增 `mockReverseGeocode`，`getTodayPriceList`/`getPriceCategoryList` 新增 `cityName` 参数）、`pages/index/index.js`、`pages/priceList/priceList.js`

## 关于地址定位精度的说明

详见 `docs/TROUBLESHOOTING.md` 问题2和问题3——这是模拟器没设置位置 + 微信官方接口精度限制共同导致的，
不是代码bug，按文档里的步骤在模拟器设置一下模拟位置就能看到真实的地图选点效果。

```bash
git add .
git commit -m "fix(v1.2.1): 补充定位权限声明/自动定位城市展示对应区域回收价/问题排查文档"
git tag -a v1.2.1 -m "修复定位权限+新增自动定位城市价格+问题排查指南"
```
