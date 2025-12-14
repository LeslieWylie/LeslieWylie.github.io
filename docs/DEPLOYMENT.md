# GitHub Pages 部署指南

本指南将帮助你将项目部署到 GitHub Pages。

## 📋 前置条件

1. 拥有一个 GitHub 账号
2. 已安装 Git
3. 项目已初始化 Git 仓库（如果还没有）

## 🚀 部署步骤

### 方法一：使用 GitHub Actions 自动部署（推荐）

#### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称设置为 `lesliewylie.github.io`（这样可以直接通过 `https://lesliewylie.github.io` 访问）
   - 或者使用其他名称，但访问地址会是 `https://lesliewylie.github.io/仓库名`
4. 设置为 Public（GitHub Pages 免费版需要 Public 仓库）
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

#### 2. 初始化本地 Git 仓库（如果还没有）

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
```

#### 3. 连接到 GitHub 仓库

```bash
# 将 <your-username> 替换为你的 GitHub 用户名
git remote add origin https://github.com/lesliewylie/lesliewylie.github.io.git
git branch -M main
git push -u origin main
```

#### 4. 启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 "Settings"（设置）
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分：
   - 选择 "GitHub Actions" 作为部署源
5. 保存设置

#### 5. 触发部署

- 当你推送代码到 `main` 分支时，GitHub Actions 会自动构建并部署
- 你也可以在仓库的 "Actions" 标签页手动触发工作流

#### 6. 访问你的网站

- 部署完成后，访问 `https://lesliewylie.github.io`
- 首次部署可能需要几分钟时间

### 方法二：手动部署

如果你不想使用 GitHub Actions，也可以手动部署：

#### 1. 构建项目

```bash
npm run build
```

#### 2. 部署 dist 目录

将 `dist` 目录的内容推送到 `gh-pages` 分支：

```bash
# 安装 gh-pages 工具（如果还没有）
npm install --save-dev gh-pages

# 在 package.json 中添加部署脚本
# "deploy": "npm run build && gh-pages -d dist"

# 执行部署
npm run deploy
```

## ⚙️ 配置说明

### Vite 配置

项目已配置为：

- 生产环境：`base: '/'`（适用于 GitHub Pages 用户页面）
- 开发环境：`base: './'`（适用于本地开发）

如果你的仓库名不是 `用户名.github.io`，需要修改 `vite.config.ts`：

```typescript
base: process.env.NODE_ENV === 'production' ? '/你的仓库名/' : './',
```

### GitHub Actions 工作流

工作流文件位于 `.github/workflows/deploy.yml`，会在以下情况触发：

- 推送到 `main` 分支
- 手动触发（在 Actions 页面）

## 🔧 常见问题

### 1. 页面显示 404

- 检查 GitHub Pages 设置中的 Source 是否选择了 "GitHub Actions"
- 确认工作流已成功运行（在 Actions 标签页查看）
- 等待几分钟让 DNS 生效

### 2. 资源文件加载失败

- 检查 `vite.config.ts` 中的 `base` 配置是否正确
- 确认构建后的文件路径是否正确

### 3. 部署后页面空白

- 检查浏览器控制台是否有错误
- 确认所有依赖都已正确安装
- 查看 GitHub Actions 日志是否有构建错误

### 4. 更改主分支名称

如果你的主分支是 `master` 而不是 `main`，需要修改 `.github/workflows/deploy.yml`：

```yaml
branches:
  - master # 改为你的主分支名
```

## 📝 更新网站

每次更新代码后：

```bash
git add .
git commit -m "更新描述"
git push origin main
```

GitHub Actions 会自动构建并部署新版本。

## 🔗 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
