# Cloudflare 实战手册 - 从克隆到上线的完整实践

> 本手册记录了 vmail 项目从零开始部署到 Cloudflare 的完整过程

## 📋 实战时间线

```
总耗时：约 2 小时
├── 准备阶段：15 分钟
├── Cloudflare 配置：30 分钟
├── GitHub 配置：20 分钟
├── 首次部署：15 分钟
├── 功能开发：30 分钟
└── 调试优化：10 分钟
```

---

## 第一步：项目克隆与准备（15分钟）

### 1.1 克隆项目

```bash
# 克隆项目到本地
git clone https://github.com/davidwuwu001/vmail.git
cd vmail

# 查看项目结构
tree -L 2
```

**项目结构**：
```
vmail/
├── frontend/              # 前端代码（React + Vite）
│   ├── src/              # 源代码
│   ├── build/            # 构建产物
│   └── package.json      # 前端依赖
├── worker/               # 后端代码（Cloudflare Workers）
│   ├── src/              # Worker 源代码
│   ├── drizzle/          # 数据库迁移文件
│   └── drizzle.config.ts # 数据库配置
├── wrangler.toml         # Cloudflare 配置文件
├── package.json          # 根项目配置
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions 配置
```

### 1.2 安装依赖

```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm

# 安装项目依赖
pnpm install

# 验证安装
pnpm run build
```

**预期输出**：
```
✓ 1374 modules transformed.
build/client/index.html                  0.46 kB
build/client/assets/main-xxx.css        31.29 kB
build/client/assets/main-xxx.js        547.33 kB
✓ built in 1.55s
✅ 已创建 404.html
```

---

## 第二步：Cloudflare 账号配置（30分钟）

### 2.1 注册 Cloudflare 账号

1. 访问 https://dash.cloudflare.com/sign-up
2. 使用邮箱注册
3. 验证邮箱
4. 完成账号设置

### 2.2 添加域名到 Cloudflare

```
步骤：
1. 点击 "添加站点"
2. 输入域名：dawuls.com
3. 选择免费计划
4. 复制 Cloudflare 的 Nameservers
5. 到域名注册商（阿里云）修改 DNS
6. 等待 DNS 生效（5-30分钟）
```

**DNS 配置示例**：
```
阿里云域名管理
├── 域名：dawuls.com
└── DNS 服务器：
    ├── 修改前：阿里云 DNS
    │   ├── dns1.hichina.com
    │   └── dns2.hichina.com
    └── 修改后：Cloudflare DNS
        ├── aron.ns.cloudflare.com
        └── maya.ns.cloudflare.com
```

### 2.3 创建 D1 数据库

```bash
# 方法1：通过 Dashboard（推荐新手）
1. 登录 Cloudflare Dashboard
2. 左侧菜单 → Workers & Pages → D1
3. 点击 "Create database"
4. 输入名称：vmail
5. 点击 "Create"
6. 复制 Database ID

# 方法2：通过命令行（推荐熟手）
npx wrangler d1 create vmail
```

**记录信息**：
```
数据库名称：vmail
数据库 ID：b0bbf750-b563-49ba-ae03-4687503ed4a4
```

### 2.4 配置 Email Routing

```
步骤：
1. Cloudflare Dashboard → Email → Email Routing
2. 启用 Email Routing
3. 添加路由规则：
   ├── 匹配：*@dawuls.com
   └── 操作：Send to Worker
4. 验证 DNS 记录（自动添加）
```

**自动添加的 DNS 记录**：
```
类型    名称    内容
MX      @       route1.mx.cloudflare.net (优先级: 89)
MX      @       route2.mx.cloudflare.net (优先级: 17)
MX      @       route3.mx.cloudflare.net (优先级: 70)
TXT     @       v=spf1 include:_spf.mx.cloudflare.net ~all
```

### 2.5 配置 Turnstile（人机验证）

```
步骤：
1. Cloudflare Dashboard → Turnstile
2. 点击 "Add site"
3. 配置：
   ├── 站点名称：vmail
   ├── 域名：vmail.dawuls.com
   └── Widget 模式：Managed
4. 创建后复制密钥
```

**记录信息**：
```
站点密钥（公开）：0x4AAAAAACM_jYKkxDfVfhC7
密钥（私密）：0x4AAAAAACM_jVtDrktz_XnG0HgtF0Rna0Q
```

### 2.6 生成 API Token

```
步骤：
1. Cloudflare Dashboard → 右上角头像 → My Profile
2. API Tokens → Create Token
3. 选择模板："Edit Cloudflare Workers"
4. 或自定义权限：
   ├── Account - Cloudflare Pages - Edit
   ├── Account - D1 - Edit
   └── Zone - Workers Routes - Edit
5. 创建并复制 Token
```

**记录信息**：
```
API Token：0g2RgpgYRnbMLzuL9at2m9sMOMe3owF05RF4YaAw
Account ID：db2645f3e7d4fcc17f20c028a285c1b7
```

### 2.7 生成 Cookies Secret

```bash
# 生成随机密钥
openssl rand -base64 32

# 输出示例
ANqEYzCuAoftWf5wbLvN2qrETigHwZx/da/B1D7dFCY=
```

---

## 第三步：GitHub 配置（20分钟）

### 3.1 Fork 或推送项目到 GitHub

```bash
# 如果是新项目
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/davidwuwu001/vmail.git
git push -u origin main

# 如果是 Fork 的项目
# 直接在 GitHub 上 Fork 即可
```

### 3.2 配置 GitHub Secrets

```
步骤：
1. 打开 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 逐个添加以下密钥
```

**需要添加的 8 个密钥**：

| 名称 | 值 | 说明 |
|------|-----|------|
| `CF_API_TOKEN` | `0g2RgpgYRnbMLzuL9at2m9sMOMe3owF05RF4YaAw` | Cloudflare API 令牌 |
| `CF_ACCOUNT_ID` | `db2645f3e7d4fcc17f20c028a285c1b7` | Cloudflare 账户 ID |
| `D1_DATABASE_ID` | `b0bbf750-b563-49ba-ae03-4687503ed4a4` | D1 数据库 ID |
| `D1_DATABASE_NAME` | `vmail` | D1 数据库名称 |
| `EMAIL_DOMAIN` | `dawuls.com` | 邮箱域名 |
| `COOKIES_SECRET` | `ANqEYzCuAoftWf5wbLvN2qrETigHwZx/da/B1D7dFCY=` | Cookie 加密密钥 |
| `TURNSTILE_KEY` | `0x4AAAAAACM_jYKkxDfVfhC7` | Turnstile 公钥 |
| `TURNSTILE_SECRET` | `0x4AAAAAACM_jVtDrktz_XnG0HgtF0Rna0Q` | Turnstile 私钥 |

### 3.3 验证 GitHub Actions 配置

```bash
# 查看工作流文件
cat .github/workflows/deploy.yml

# 确认配置正确
# - 分支名称是否正确（main）
# - 密钥引用是否正确（${{ secrets.XXX }}）
# - 命令是否正确
```

---

## 第四步：首次部署（15分钟）

### 4.1 触发首次部署

```bash
# 方法1：推送代码触发
git add .
git commit -m "feat: initial deployment"
git push origin main

# 方法2：手动触发
# GitHub → Actions → Deploy to Cloudflare → Run workflow
```

### 4.2 监控部署过程

```
GitHub Actions 界面：
1. 打开 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看正在运行的工作流
4. 点击进入查看详细日志
```

**部署步骤**：
```
✓ Checkout code                    # 检出代码
✓ Setup pnpm                        # 设置 pnpm
✓ Setup Node.js                     # 设置 Node.js
✓ Install dependencies              # 安装依赖
✓ Build                             # 构建项目
✓ Configure Wrangler                # 配置 Wrangler
✓ Apply D1 Migrations               # 应用数据库迁移
✓ Deploy                            # 部署到 Cloudflare
```

### 4.3 验证部署结果

```bash
# 检查 Pages 部署
# Cloudflare Dashboard → Pages → vmail
# 查看部署状态和 URL

# 检查 Workers 部署
# Cloudflare Dashboard → Workers & Pages → vmail
# 查看 Worker 状态

# 检查数据库迁移
npx wrangler d1 execute vmail --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

**预期输出**：
```
┌─────────────────┐
│ name            │
├─────────────────┤
│ _cf_KV          │
│ d1_migrations   │
│ emails          │
│ mailboxes       │
│ users           │
└─────────────────┘
```

### 4.4 配置自定义域名

```
步骤：
1. Cloudflare Dashboard → Pages → vmail → Custom domains
2. 点击 "Set up a custom domain"
3. 输入：vmail.dawuls.com
4. 点击 "Activate domain"
5. 等待 DNS 生效（1-5分钟）
```

**自动添加的 DNS 记录**：
```
类型     名称    内容                        代理状态
CNAME    vmail   vmail-8g9.pages.dev        已代理（橙色云朵）
```

### 4.5 测试网站

```bash
# 测试主页
curl https://vmail.dawuls.com/

# 测试 API
curl https://vmail.dawuls.com/config

# 测试注册
curl -X POST https://vmail.dawuls.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123456"}'
```

---

## 第五步：功能开发与迭代（30分钟）

### 5.1 本地开发

```bash
# 启动开发服务器
cd frontend
pnpm run dev

# 在浏览器打开
# http://localhost:5173
```

### 5.2 修改代码

**示例：修改 Dashboard 样式**

```typescript
// vmail/frontend/src/pages/Dashboard.tsx
// 修改前
<div className="bg-gray-800 rounded-lg">

// 修改后
<div className="bg-neutral-800 rounded-lg border border-cyan-50/20">
```

### 5.3 本地测试

```bash
# 构建测试
pnpm run build

# 检查构建产物
ls -lh frontend/build/client/
```

### 5.4 提交并部署

```bash
# 提交代码
git add .
git commit -m "feat: improve Dashboard UI"
git push origin main

# 自动触发部署
# 等待 1-2 分钟
# 访问 https://vmail.dawuls.com 查看效果
```

---

## 第六步：调试与优化（10分钟）

### 6.1 查看部署日志

```
GitHub Actions 日志：
1. GitHub → Actions → 最新的工作流
2. 展开每个步骤查看详细日志
3. 查找错误信息（红色 ❌）
```

### 6.2 查看 Worker 日志

```bash
# 实时查看日志
npx wrangler tail

# 或在 Dashboard 查看
# Cloudflare Dashboard → Workers & Pages → vmail → Logs
```

### 6.3 常见问题排查

**问题1：部署失败**
```bash
# 检查 API Token 权限
# Cloudflare Dashboard → My Profile → API Tokens
# 确认 Token 有正确的权限

# 重新生成 Token
# 更新 GitHub Secrets
```

**问题2：数据库连接失败**
```bash
# 检查数据库 ID
npx wrangler d1 list

# 检查迁移状态
npx wrangler d1 migrations list vmail --remote

# 手动执行迁移
npx wrangler d1 migrations apply vmail --remote
```

**问题3：邮件接收失败**
```bash
# 检查 Email Routing 配置
# Cloudflare Dashboard → Email → Email Routing

# 检查 DNS 记录
# 确认 MX 记录已添加

# 测试邮件发送
# 从 QQ 邮箱发送测试邮件
```

---

## 实战经验总结

### ✅ 成功要点

1. **配置要完整**
   - 8 个 GitHub Secrets 一个都不能少
   - DNS 记录要等待生效
   - API Token 权限要正确

2. **部署要耐心**
   - 首次部署需要 1-2 分钟
   - DNS 生效需要 5-30 分钟
   - 遇到问题先查日志

3. **测试要充分**
   - 本地测试通过再部署
   - 部署后测试所有功能
   - 发现问题及时修复

### ⚠️ 常见陷阱

1. **API Token 权限不足**
   ```
   错误：403 Forbidden
   原因：Token 权限不够
   解决：重新生成 Token，选择正确的权限模板
   ```

2. **数据库 ID 错误**
   ```
   错误：Database not found
   原因：wrangler.toml 中的 database_id 不正确
   解决：检查并更新正确的 ID
   ```

3. **DNS 未生效**
   ```
   错误：域名无法访问
   原因：DNS 还在传播中
   解决：等待 5-30 分钟，或使用 dig 命令检查
   ```

4. **构建失败**
   ```
   错误：Build failed
   原因：依赖安装失败或代码错误
   解决：本地先测试构建，确保无误后再推送
   ```

### 🎯 优化建议

1. **使用环境变量**
   ```toml
   # wrangler.toml
   [vars]
   EMAIL_DOMAIN = "dawuls.com"
   TURNSTILE_KEY = "0x4AAAAAACM_jYKkxDfVfhC7"
   ```

2. **配置缓存**
   ```yaml
   # .github/workflows/deploy.yml
   - name: Cache pnpm modules
     uses: actions/cache@v3
     with:
       path: ~/.pnpm-store
       key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
   ```

3. **添加健康检查**
   ```typescript
   // worker/src/index.ts
   app.get('/health', (c) => {
     return c.json({ status: 'ok', timestamp: Date.now() });
   });
   ```

---

## 下一步行动

### 📚 深入学习

1. **Cloudflare Workers**
   - 学习 Workers 的高级特性
   - 了解 KV、Durable Objects
   - 探索 Workers AI

2. **GitHub Actions**
   - 学习更多 Actions 用法
   - 配置多环境部署
   - 添加自动化测试

3. **性能优化**
   - 配置 CDN 缓存策略
   - 优化图片和资源
   - 使用 Web Workers

### 🚀 项目扩展

1. **添加新功能**
   - 邮件搜索
   - 邮件标签
   - 邮件导出

2. **改进用户体验**
   - 添加加载动画
   - 优化移动端适配
   - 支持多语言

3. **增强安全性**
   - 添加速率限制
   - 实现 2FA 认证
   - 加密敏感数据

---

## 附录：完整配置清单

### Cloudflare 配置

- [ ] 注册 Cloudflare 账号
- [ ] 添加域名到 Cloudflare
- [ ] 创建 D1 数据库
- [ ] 配置 Email Routing
- [ ] 配置 Turnstile
- [ ] 生成 API Token
- [ ] 生成 Cookies Secret

### GitHub 配置

- [ ] 创建/Fork 仓库
- [ ] 配置 8 个 Secrets
- [ ] 验证 Actions 配置
- [ ] 启用 Actions

### 部署验证

- [ ] 首次部署成功
- [ ] 数据库迁移成功
- [ ] 自定义域名生效
- [ ] 网站可以访问
- [ ] API 正常工作
- [ ] 邮件接收正常

### 功能测试

- [ ] 用户注册
- [ ] 用户登录
- [ ] 创建邮箱
- [ ] 接收邮件
- [ ] 查看邮件
- [ ] 删除邮箱

---

**恭喜你完成了整个实战流程！** 🎉

现在你已经掌握了：
- ✅ Cloudflare 平台的使用
- ✅ GitHub Actions 的配置
- ✅ 完整的 CI/CD 流程
- ✅ 问题排查和优化技巧

继续探索，创造更多精彩的项目！
