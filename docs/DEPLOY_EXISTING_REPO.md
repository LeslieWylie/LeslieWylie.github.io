# 部署到已有仓库指南

本指南专门针对 `lesliewylie.github.io` 这个已存在的仓库。

## 📋 当前情况

- 仓库已存在：`https://github.com/lesliewylie/lesliewylie.github.io`
- 之前部署过 Hexo 博客
- 旧博客源码已备份在 `blog/LeslieWylie.github.io/` 目录

## 🚀 部署步骤

### 方法一：在当前项目目录直接部署（推荐）

#### 1. 初始化 Git 并连接到现有仓库

```bash
# 在 lifekline 项目根目录执行
git init
git remote add origin https://github.com/lesliewylie/lesliewylie.github.io.git

# 拉取远程仓库内容（如果有）
git fetch origin

# 检查远程分支
git branch -r
```

#### 2. 处理远程分支

如果远程仓库有 `main` 或 `master` 分支：

```bash
# 如果远程是 main 分支
git checkout -b main
git pull origin main --allow-unrelated-histories

# 如果远程是 master 分支
git checkout -b master
git pull origin master --allow-unrelated-histories
```

如果遇到冲突，可以选择：

- **选项 A**：保留新项目，删除旧内容

  ```bash
  # 强制使用当前项目内容
  git add .
  git commit -m "Replace with lifekline project"
  git push origin main --force  # 谨慎使用！
  ```

- **选项 B**：合并两个项目（不推荐，因为会混合内容）

#### 3. 如果远程仓库是空的或只有 gh-pages 分支

```bash
# 创建并切换到 main 分支
git checkout -b main

# 添加所有文件
git add .

# 提交
git commit -m "Deploy lifekline project to GitHub Pages"

# 推送到远程
git push -u origin main
```

### 方法二：克隆仓库后替换内容

#### 1. 克隆现有仓库

```bash
# 在项目父目录执行
cd ..
git clone https://github.com/lesliewylie/lesliewylie.github.io.git
cd lesliewylie.github.io
```

#### 2. 备份旧内容（可选）

```bash
# 创建备份分支
git checkout -b backup-old-blog
git add .
git commit -m "Backup old Hexo blog"
git push origin backup-old-blog
git checkout main  # 或 master
```

#### 3. 清理并复制新项目

```bash
# 删除旧文件（保留 .git）
# Windows PowerShell
Get-ChildItem -Exclude .git | Remove-Item -Recurse -Force

# 然后从 lifekline 目录复制所有文件到这里
# 可以使用文件管理器手动复制，或使用命令：
# xcopy /E /I ..\lifekline\* .
```

#### 4. 提交并推送

```bash
git add .
git commit -m "Replace with lifekline project"
git push origin main  # 或 master
```

## ⚙️ 配置 GitHub Pages

1. 访问仓库设置：`https://github.com/lesliewylie/lesliewylie.github.io/settings/pages`

2. 在 "Source" 部分：

   - 选择 **"GitHub Actions"** 作为部署源
   - 如果之前是 "Deploy from a branch"，需要先改为 "GitHub Actions"

3. 保存设置

## 🔍 验证部署

1. 推送代码后，访问仓库的 **Actions** 标签页
2. 查看工作流运行状态
3. 等待部署完成（通常 1-2 分钟）
4. 访问 `https://lesliewylie.github.io` 查看网站

## ⚠️ 注意事项

1. **强制推送警告**：如果使用 `--force` 推送，会覆盖远程仓库的所有内容，请确保已备份重要内容

2. **分支名称**：确认你的主分支是 `main` 还是 `master`，并相应修改 `.github/workflows/deploy.yml`

3. **旧博客备份**：`blog/LeslieWylie.github.io/` 目录中的内容是旧博客的构建产物，如果需要恢复，可以从备份分支恢复

4. **首次部署**：首次部署可能需要几分钟时间，GitHub Pages 需要时间来构建和发布

## 🐛 常见问题

### Q: 推送时提示 "refusing to merge unrelated histories"

A: 使用 `--allow-unrelated-histories` 参数：

```bash
git pull origin main --allow-unrelated-histories
```

### Q: 工作流没有自动触发

A: 检查：

- `.github/workflows/deploy.yml` 文件是否存在
- 分支名称是否匹配（main 或 master）
- GitHub Pages 设置是否选择了 "GitHub Actions"

### Q: 部署后还是显示旧博客

A:

- 清除浏览器缓存
- 检查 GitHub Actions 是否成功运行
- 等待几分钟让 CDN 更新

## 📝 快速命令总结

```bash
# 在 lifekline 项目目录
git init
git remote add origin https://github.com/lesliewylie/lesliewylie.github.io.git
git add .
git commit -m "Deploy lifekline project"
git branch -M main
git push -u origin main --force  # 如果确定要替换所有内容
```
