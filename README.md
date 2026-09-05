# 京师北欧 / JINGSH Nordic

[www.jingsh.fi](https://www.jingsh.fi) 官方网站 — 基于 **Nuxt 4** + **[nuxtcms](https://github.com/guxingbiao0507/nuxtcms)** 构建的双语（英文 / 中文）律所站点，部署在 **Cloudflare Pages + D1 + R2**。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Nuxt 4、Vue 3 |
| CMS | nuxtcms（Layer 扩展） |
| 样式 | Tailwind CSS 4、自定义 `jingsh.css` 主题 |
| 多语言 | `@nuxtjs/i18n`（`en` / `cn`，URL 前缀策略） |
| SEO | `@nuxtjs/seo`、Sitemap、Robots、JSON-LD |
| 本地数据库 | SQLite（`.data/jingsh.sqlite`） |
| 生产数据库 | Cloudflare D1 |
| 媒体存储 | Cloudflare R2（本地开发用文件系统） |
| 部署 | Cloudflare Pages（Git 集成或 Wrangler CLI） |

---

## 项目结构

```
jingsh-site/
├── app/                    # 前端页面与组件
│   ├── pages/              # 首页、新闻、博客、管理登录等
│   ├── components/         # Jingsh 主题组件
│   ├── composables/        # 语言、导航、新闻、资源 URL
│   ├── assets/css/         # jingsh.css 主题样式
│   └── plugins/            # Clarity 等客户端插件
├── i18n/locales/           # en.json、cn.json 界面文案
├── public/assets/themes/jingsh/images/  # 主题图片（Git 跟踪）
├── server/
│   ├── api/__sitemap__/    # 自定义 Sitemap 数据源
│   └── database/           # 数据库入口（转发 nuxtcms）
├── scripts/                # 种子数据、抓取、R2 上传、部署辅助
├── nuxt.config.ts          # 站点 / SEO / 重定向 / Cloudflare 预设
├── wrangler.toml           # D1、R2、Pages 输出目录
├── .env                    # 本地环境变量（不提交）
└── .cloudflare.env         # Cloudflare API 凭证（不提交）
```

---

## 快速开始

### 环境要求

- Node.js **22**（见 `.node-version`）
- pnpm **8.15.9**（见 `packageManager`）

### 安装与开发

```bash
pnpm install
cp .env.example .env          # 按需修改
pnpm run seed:site            # 初始化本地 SQLite + 管理员账号
pnpm dev                      # http://localhost:3000
```

### 管理后台

| 项目 | 值 |
|------|-----|
| 地址 | `/en/admin/login` 或 `/cn/admin/login` |
| 邮箱 | `admin@jingsh.fi` |
| 密码 | 见 `seed-jingsh-site.mjs` 或 `.env` 中 `JINGSH_ADMIN_PASSWORD` |

登录前需勾选「我不是机器人」验证框。

---

## 环境变量

### `.env`（本地开发）

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | 本地 SQLite，默认 `file:.data/jingsh.sqlite` |
| `NUXT_PUBLIC_SITE_URL` | 站点 canonical URL，默认 `https://www.jingsh.fi` |
| `NUXT_JWT_SECRET` | JWT 签名密钥（≥32 字符） |
| `NUXT_SESSION_PASSWORD` | Session 加密密钥（≥32 字符） |
| `NUXT_ALTCHA_HMAC_KEY` | 验证码 HMAC（可选） |
| `JINGSH_ADMIN_EMAIL` | 种子脚本管理员邮箱（可选） |
| `JINGSH_ADMIN_PASSWORD` | 种子脚本管理员密码（可选） |

### `.cloudflare.env`（部署 / Wrangler）

复制 `.cloudflare.env.example` 后填写：

| 变量 | 说明 |
|------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 账户 ID |
| `CF_PAGES_PROJECT` | Pages 项目名，默认 `jingshi` |
| `CF_D1_DATABASE` | D1 数据库名，默认 `jingshi` |
| `CF_R2_BUCKET` | R2 存储桶，默认 `jingshi` |

生产环境还应在 **Cloudflare Pages → Settings → Environment variables** 中配置与 `.env` 相同的 `NUXT_*` 密钥（`cf-prep.mjs` 可自动同步）。

---

## npm 脚本一览

### 开发与构建

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发（SQLite） |
| `pnpm build` | 构建；在 Cloudflare Pages 上自动识别 `CF_PAGES=1` 并使用 `cloudflare_pages` 预设 |
| `pnpm build:cf` | 显式指定 Cloudflare Pages 预设并执行 worker 补丁 |
| `pnpm pages:build` | Git 部署用构建命令（同 `build`） |

### 部署

| 命令 | 说明 |
|------|------|
| `pnpm deploy` | `cf-prep` → 同步资源到 R2 → 构建并 Wrangler 部署 |
| `pnpm deploy:migrate` | 同上，且先执行 D1 远程迁移 |

### 站点与内容种子

| 命令 | 说明 |
|------|------|
| `pnpm seed:site` | 写入站点设置、SEO、管理员账号到本地 SQLite |
| `pnpm seed:cloudflare` | 本地 seed → 同步 CMS 数据到远程 D1 |
| `pnpm scrape:news` | 从 jingsh.fi（Wayback）抓取新闻正文与图片 |
| `pnpm seed:news` | 将抓取结果写入本地数据库 |
| `pnpm sync:news` | 抓取 + 种子 + 上传新闻图片到 R2 |

### 静态资源

| 命令 | 说明 |
|------|------|
| `pnpm fetch:assets` | 从原站下载主题图片到 `public/` 与 `.data/uploads/` |
| `pnpm upload:r2` | 上传 `public/assets/**` 与 `.data/uploads/**` 到 R2 |
| `pnpm sync:assets` | `fetch:assets` + `upload:r2`（`deploy` 前自动执行） |

---

## scripts/ 目录说明

| 脚本 | 用途 |
|------|------|
| `cf-prep.mjs` | 检查/创建 D1、R2、Pages 项目；同步 `wrangler.toml`；设置 Pages Secrets |
| `seed-jingsh-site.mjs` | 站点全局设置、多语言 SEO、管理员密码（与 nuxt-auth-utils 兼容的 Scrypt 哈希） |
| `seed-jingsh-news.mjs` | 从 `.data/scraped/jingsh-news.json` 写入 8 篇新闻（en + cn） |
| `seed-cloudflare.mjs` | 本地数据库导出并批量写入 Cloudflare D1 |
| `scrape-jingsh-news.mjs` | 抓取原站 4 篇新闻及 CDN 图片 |
| `sync-jingsh-news.mjs` | 新闻抓取 + 种子 + R2 上传 |
| `fetch-jingsh-assets.mjs` | 下载主题静态图片 |
| `upload-r2-assets.mjs` | 批量上传到 R2 桶 |
| `sync-assets.mjs` | 资源抓取与 R2 同步编排 |
| `inspect-db.mjs` / `compare-schema.mjs` | 数据库调试（开发用） |

---

## SEO 与分析

### 页面标题

- **首页**：`京师北欧 / JINGSH Nordic`（无后缀）
- **内页**：`页面标题 · 京师北欧 / JINGSH Nordic`
- 已覆盖 nuxtcms 默认的 `NuxtCMS` 后缀模板

### Sitemap 与 Robots

- 索引：`/sitemap_index.xml`
- 分语言：`/__sitemap__/en.xml`、`/__sitemap__/cn.xml`
- 数据源：`server/api/__sitemap__/urls.get.ts`（首页、新闻列表、已发布博客）
- 每条 URL 含 **`lastmod`**（文章用 `updated_at`，无效时回退 `published_at`；首页/新闻列表用最新内容时间）
- 含 `hreflang`  alternate（`en`、`zh-CN`、`x-default`）
- `robots.txt` 由 `@nuxtjs/seo` 生成

### 结构化数据

- 全站 `Organization` JSON-LD（`app/app.vue`）
- 博客文章 `BlogPosting` JSON-LD（`app/pages/blog/[slug].vue`）

### Feed

- JSON Feed：`/api/public/feed.json`
- RSS：`/api/public/feed.xml`

### 分析与验证（CMS 可配置）

| 服务 | ID / 说明 | 配置位置 |
|------|-----------|----------|
| Google Analytics 4 | `G-T7LDC2SCF5` | `nuxt.config.ts` + CMS `ga4MeasurementId` |
| Microsoft Clarity | `s16fx7yyr5` | CMS `clarityProjectId` + `jingsh-analytics.client.ts` |
| Bing 站点验证 | 可选 | CMS `bingSiteVerification` |
| Google Search Console | 可选 | CMS `googleVerification` |

### Open Graph 与 Meta

- 默认 OG 图：`/assets/themes/jingsh/images/jingshi-top-bg.png`
- 站点描述、关键词通过 CMS **设置** 或 `seed:site` 写入
- 文章级：`meta_title`、`meta_description`、`og_image`、`canonical_url` 等字段

### 旧 URL 301 重定向

原 `jingsh.fi` 静态页已映射到新路由（见 `nuxt.config.ts` → `routeRules`）：

| 旧路径 | 新路径 |
|--------|--------|
| `/news-blogs.html` | `/en/news` |
| `/news-blogs/1.html` … `4.html` | 对应 `/en/blog/{slug}` |

---

## 部署

### 方式一：Git 集成（推荐）

Cloudflare Pages 连接仓库后，构建设置：

| 项 | 值 |
|----|-----|
| Build command | `pnpm run build` |
| Build output directory | `dist` |
| Node version | 22 |

推送 `main` 分支后自动构建。首次部署前建议本地执行：

```bash
pnpm run seed:cloudflare   # 同步 CMS 数据到 D1
node scripts/cf-prep.mjs   # 同步 Pages Secrets
```

### 方式二：Wrangler CLI

```bash
cp .cloudflare.env.example .cloudflare.env   # 填入凭证
pnpm run deploy:migrate                      # 迁移 + 构建 + 部署
```

### 生产架构

```
用户 → Cloudflare Pages (Nuxt SSR/Worker)
         ├── D1 (DB)     CMS 数据：用户、文章、设置
         └── R2 (BUCKET) 媒体与上传文件
```

---

## 多语言

| 代码 | URL 前缀 | 语言 |
|------|----------|------|
| `en` | `/en/...` | English（默认） |
| `cn` | `/cn/...` | 简体中文 |

根路径 `/` 由 i18n 重定向到默认语言。

---

## 常见问题

**Git 部署 `pnpm install` 失败（lockfile mismatch）**  
本地修改 `package.json` 的 `pnpm` 配置后，需运行 `pnpm install --no-frozen-lockfile` 并提交 `pnpm-lock.yaml`。

**Cloudflare 后台登录失败**  
1. 勾选登录页验证框  
2. 运行 `pnpm run seed:cloudflare` 重置远程 D1 管理员密码  
3. 运行 `node scripts/cf-prep.mjs` 确保 `NUXT_SESSION_PASSWORD` / `NUXT_JWT_SECRET` 与本地 `.env` 一致  

**图片在生产环境 404**  
执行 `pnpm run sync:assets` 将主题图与 `.data/uploads/` 上传到 R2。

---

## 许可证

私有项目 — 京师律师事务所 / JINGSH Nordic。
