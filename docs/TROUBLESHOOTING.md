# 故障排除指南

## 无法访问 http://localhost:5173

### 检查步骤

#### 1. 确认开发服务器正在运行

**Windows PowerShell:**
```powershell
netstat -ano | findstr :5173
```

如果看到 `LISTENING` 状态，说明服务器正在运行。

#### 2. 尝试不同的访问地址

如果 `localhost` 无法访问，尝试：

- **http://127.0.0.1:5173**
- **http://0.0.0.0:5173**
- **http://[你的IP地址]:5173**

#### 3. 检查防火墙设置

Windows 防火墙可能阻止了访问：

1. 打开"Windows Defender 防火墙"
2. 点击"允许应用通过防火墙"
3. 确保 Node.js 被允许通过防火墙

#### 4. 重启开发服务器

**停止当前服务器：**
```bash
# 在终端按 Ctrl+C 停止服务器
```

**重新启动：**
```bash
npm run dev
```

#### 5. 检查端口是否被占用

如果 5173 端口被占用，Vite 会自动尝试下一个可用端口（5174, 5175 等）。

查看终端输出，会显示实际使用的端口：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

#### 6. 清除浏览器缓存

1. 按 `Ctrl + Shift + Delete` 打开清除数据对话框
2. 选择"缓存的图像和文件"
3. 点击"清除数据"
4. 刷新页面（`Ctrl + F5`）

#### 7. 检查浏览器控制台

按 `F12` 打开开发者工具，查看 Console 标签页是否有错误信息。

#### 8. 尝试使用其他浏览器

- Chrome
- Firefox
- Edge

#### 9. 检查 Node.js 版本

确保 Node.js 版本 >= 18.0.0：

```bash
node --version
```

#### 10. 重新安装依赖

如果以上方法都不行，尝试重新安装依赖：

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 启动开发服务器
npm run dev
```

### 常见错误及解决方案

#### 错误：`EADDRINUSE: address already in use :::5173`

**原因：** 端口已被占用

**解决方案：**
1. 找到占用端口的进程并结束它
2. 或者修改 `vite.config.ts` 使用其他端口

#### 错误：`Cannot find module`

**原因：** 依赖未正确安装

**解决方案：**
```bash
npm install
```

#### 错误：页面空白

**原因：** 可能是构建错误或路由问题

**解决方案：**
1. 查看终端是否有错误信息
2. 查看浏览器控制台错误
3. 检查 `src/index.tsx` 是否正确

### 快速诊断命令

```bash
# 1. 检查端口占用
netstat -ano | findstr :5173

# 2. 检查 Node.js 进程
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# 3. 检查项目依赖
npm list --depth=0

# 4. 验证构建
npm run build
```

### 如果仍然无法访问

1. **查看终端输出**：开发服务器启动时会显示访问地址
2. **检查网络设置**：确保没有代理或 VPN 干扰
3. **查看 Vite 日志**：终端会显示详细的启动信息

### 联系支持

如果以上方法都无法解决问题，请提供：
- 终端输出的完整错误信息
- 浏览器控制台的错误信息
- 操作系统版本
- Node.js 版本

