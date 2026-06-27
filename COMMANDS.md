# VSCode 终端执行命令清单

本项目是纯静态小程序代码，**不需要 npm install**，不需要任何构建命令。
下面这些命令是给你在 VSCode 「终端」（菜单 终端 / Terminal → 新建终端）里，
做"项目管理"用的，不是必须的，但建议执行第 1、2 步建立版本管理习惯。

> 以下命令以 Mac/Linux 的 bash/zsh 语法为例；Windows 用户在 VSCode 终端默认是
> PowerShell，命令基本通用，个别地方已标注差异。

---

## 1. 进入项目目录并查看结构

```bash
cd recycle-miniprogram
ls -la
```

确认能看到 `app.js app.json app.wxss config pages utils docs project.config.json sitemap.json`。

---

## 2. 初始化 Git 仓库（强烈建议，方便以后回退/对比改动）

```bash
git init
```

创建 `.gitignore`，避免以后接入构建工具/npm依赖时把无关文件提交进去：

```bash
cat > .gitignore << 'EOF'
node_modules/
.DS_Store
miniprogram_npm/
unpackage/
EOF
```

提交第一版代码：

```bash
git add .
git commit -m "feat: 资源回收小程序前端原型 v1（用户端首页/订单列表/我的 + 商户端接单大厅/我的任务/推广中心，全部Mock数据）"
```

（可选）如果你已经在 GitHub/Gitee 创建了远程仓库，并已经在 VSCode 配置好授权：

```bash
git remote add origin <你的远程仓库地址>
git branch -M main
git push -u origin main
```

---

## 3. 用 VSCode 命令行方式打开项目（如果你不是通过菜单打开的）

在系统终端（不是 VSCode 内置终端，是 Mac 终端 / Windows PowerShell/CMD）里，
确保安装过 VSCode 的 `code` 命令行工具后，可以直接：

```bash
code recycle-miniprogram
```

这样会用 VSCode 直接打开整个项目文件夹。

---

## 4. 校验所有 JSON 配置文件格式是否正确（小程序对 JSON 格式要求很严格，不能有注释、不能有多余逗号）

如果你本地装了 Node.js（用 `node -v` 检查），可以用下面的命令批量校验，
比手动一个个打开检查快很多：

```bash
node -e "
const fs = require('fs');
const path = require('path');
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) return walk(p);
    if (p.endsWith('.json')) {
      try { JSON.parse(fs.readFileSync(p, 'utf8')); console.log('OK  ', p); }
      catch (e) { console.log('FAIL', p, '->', e.message); }
    }
  });
}
walk('.');
"
```

看到全部输出 `OK` 即说明所有 `.json` 配置文件格式正确，可以放心丢进微信开发者工具。

---

## 5. 打包代码方便分享给别人体验（不通过小程序发布，仅分享源码）

```bash
cd ..
zip -r recycle-miniprogram.zip recycle-miniprogram -x "*.git*"
```

Windows PowerShell 等价命令：

```powershell
Compress-Archive -Path recycle-miniprogram -DestinationPath recycle-miniprogram.zip
```

这一步只是把源代码打包发给别人用微信开发者工具自己导入运行；
**真正想让普通人在自己手机上免安装体验**，需要走 `docs/SETUP.md` 第六步里的
"预览二维码"或"发布体验版"流程，那一步是在「微信开发者工具」里点按钮完成的，
不是在 VSCode 终端里执行命令。

---

## 命令执行顺序总结

```
1. cd recycle-miniprogram
2. git init && git add . && git commit -m "..."
3. （可选）git remote add / push 到远程仓库
4. node -e "...校验json..."
5. 打开微信开发者工具 -> 导入该文件夹 -> 看到模拟器即成功（这一步不在VSCode里做）
```
