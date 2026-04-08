# 👶 宝宝成长记

记录宝宝每一个珍贵的成长瞬间。支持时间线浏览、瀑布流相册、照片管理，数据存储在浏览器本地。

## 功能

- **时间线**：按年月分组展示成长记录，自动计算月龄/岁数
- **瀑布流相册**：所有照片以响应式瀑布流排版展示，支持标签筛选
- **添加/编辑记录**：日期、标题、描述、标签、多张照片
- **图片预览**：全屏查看，键盘翻页，支持下载
- **设置**：宝宝姓名、出生日期配置

## 本地开发

**环境要求**：Node.js 18+

```bash
# 克隆项目
git clone https://github.com/rudymemo/baby-timeline.git
cd baby-timeline

# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

## 部署

构建产物为纯静态文件（`dist/` 目录），可部署到任意静态托管平台。

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 前往 [vercel.com](https://vercel.com)，导入仓库
3. Framework Preset 选择 **Vite**，其余保持默认
4. 点击 **Deploy**，完成后自动获得公网地址

### Netlify

1. 将代码推送到 GitHub
2. 前往 [netlify.com](https://www.netlify.com)，点击 **Add new site → Import an existing project**
3. 授权并选择仓库，配置如下：
   - Build command：`npm run build`
   - Publish directory：`dist`
4. 点击 **Deploy site**

### GitHub Pages

```bash
# 安装 gh-pages 工具
npm install -D gh-pages

# 构建并发布到 gh-pages 分支
npm run build && npx gh-pages -d dist
```

然后在仓库设置的 **Pages** 页面，将 Source 设置为 `gh-pages` 分支即可访问。

> 如果部署在子路径（如 `https://xxx.github.io/baby-timeline/`），需在 `vite.config.js` 中添加 `base: '/baby-timeline/'`。

### 自托管（Nginx）

```bash
# 构建
npm run build

# 将 dist/ 目录上传到服务器，Nginx 配置示例：
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/baby-timeline/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 数据说明

所有数据（记录文字 + 照片）存储在浏览器 **localStorage** 中，不会上传到任何服务器。

- 照片上传时会自动压缩（最大边 1200px，质量 75%），以节省存储空间
- localStorage 通常有 5~10 MB 限制，建议照片数量适度
- 清空浏览器缓存或换设备后数据不会同步，如需备份请使用浏览器开发者工具导出 localStorage 数据
