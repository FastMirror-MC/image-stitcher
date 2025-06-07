# Image Stitcher 图像拼接工具

一个现代化的在线图像拼接工具，支持多种图像格式的自动拼接与合成。基于 React + TypeScript + Tailwind CSS 构建，提供直观的拖拽操作界面。

## ✨ 特性

-   🖼️ **多格式支持** - 支持 JPG、PNG、GIF、WebP 等主流图像格式
-   🎨 **灵活布局** - 支持水平、垂直两个方向的图像拼接
-   🖱️ **拖拽排序** - 直观的拖拽界面，随意调整图像顺序
-   ⚙️ **丰富选项** - 自定义间距、边框、背景色等拼接参数
-   📱 **响应式设计** - 完美适配桌面端和移动端设备
-   🎯 **实时预览** - 实时查看拼接效果，所见即所得
-   📁 **批量处理** - 一次上传多个图像，快速完成拼接
-   💾 **高质量输出** - 保持原始图像质量的输出效果

## 🚀 快速开始

### 环境要求

-   Node.js >= 20.0.0
-   pnpm >= 8.0.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/FastMirror-MC/image-stitcher.git
cd image-stitcher

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev
```

打开 [http://localhost:5173](http://localhost:5173) 在浏览器中查看。

### 构建生产版本

```bash
# 构建项目
pnpm build

# 本地预览生产版本
pnpm preview
```

## 🎯 使用方法

### 基本使用流程

1. **上传图像** - 拖拽或点击选择多个图像文件
2. **调整顺序** - 通过拖拽调整图像的排列顺序
3. **设置选项** - 选择拼接方向、调整间距、边框等参数
4. **实时预览** - 查看右侧的拼接效果预览
5. **下载结果** - 点击下载按钮获取最终拼接图像

### 拼接选项说明

-   **拼接方向** - 选择水平或垂直拼接
-   **图像缩放** - 统一调整所有图像的尺寸比例
-   **图像间距** - 设置图像之间的间距大小
-   **边框设置** - 为每个图像添加边框效果
-   **背景颜色** - 自定义拼接区域的背景色

## 🛠️ 技术栈

-   **前端框架**: React 19 + TypeScript
-   **构建工具**: Vite 6
-   **样式方案**: Tailwind CSS 4
-   **UI 组件**: Radix UI + shadcn/ui
-   **状态管理**: Zustand
-   **图标库**: Lucide React
-   **包管理器**: pnpm

## 📁 项目结构

```
image-stitcher/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React 组件
│   │   ├── ui/            # 基础 UI 组件
│   │   ├── ImageStitcher.tsx    # 主应用组件
│   │   ├── ImageUploader.tsx    # 图像上传组件
│   │   ├── DraggableImageList.tsx # 可拖拽图像列表
│   │   ├── MergeOptions.tsx     # 拼接选项面板
│   │   └── PreviewCanvas.tsx    # 预览画布
│   ├── hooks/             # 自定义 Hook
│   ├── lib/               # 工具函数
│   └── assets/            # 资源文件
├── package.json
├── vite.config.ts         # Vite 配置
└── README.md
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 开发规范

1. 使用 TypeScript 进行类型安全的开发
2. 遵循 ESLint 配置的代码规范
3. 提交前请运行 `pnpm lint` 检查代码质量
4. 确保所有功能在主流浏览器中正常工作

### 提交 Pull Request

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 开源协议

本项目采用 MIT 协议开源。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

-   [React](https://reactjs.org/) - 用户界面构建库
-   [Vite](https://vitejs.dev/) - 现代化的前端构建工具
-   [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
-   [Radix UI](https://www.radix-ui.com/) - 无样式、可访问的 UI 组件
-   [Lucide](https://lucide.dev/) - 美观的开源图标库

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

-   提交 [GitHub Issue](https://github.com/FastMirror-MC/image-stitcher/issues)
-   发送邮件至: contact@fastmirror.net
-   访问我们的网站: [FastMirror](https://www.fastmirror.net)

---

⭐ 如果这个项目对你有帮助，请不要忘记给它一个 Star！
