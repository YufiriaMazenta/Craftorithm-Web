# Craftorithm 配方工作台

为 [Craftorithm](https://github.com/YufiriaMazenta/Craftorithm) 插件设计配方的可视化编辑器。
在浏览器里摆好材料，导出可直接用的 YAML 配置。

## 它解决什么问题

手写 Craftorithm 的配方 YAML 要记住物品 ID、槽位顺序、各配方类型的字段差异，
改错一个缩进就得回服务器里试。这个工作台把这些搬到界面上: 

- 按真实 GUI 布局摆材料，槽位对应关系一眼能看出来
- 物品 ID 带搜索和材质预览，不必背 `minecraft:` 前缀
- 导出前校验，缺材料、槽位冲突这类问题当场提示

## 支持的配方类型

| 类型                | 说明                               |
| ------------------- | ---------------------------------- |
| 有序合成 / 无序合成 | 工作台                             |
| 熔炼                | 熔炉、高炉、烟熏炉、营火           |
| 锻造                | 属性转移 (transform) 与纹样 (trim) |
| 切石                | 切石机                             |
| 酿造                | 酿造台                             |
| 铁砧                | 合并两个物品，可设定所需等级       |

配方字段、触发器类型和脚本函数当前对应 Craftorithm 1.13.5.2。

物品目录与材质来自 [mcmeta](https://github.com/misode/mcmeta)，当前对应 Minecraft 26.2。
支持物品标签 (`#minecraft:planks` 这类) 自动展开成具体物品。

除配方外还能编辑物品组和触发器，各自导出对应的 YAML。

## 界面语言

简体中文、繁体中文、英语、日语、韩语、德语、法语、西班牙语、葡萄牙语、俄语、越南语。
跟随系统深浅色，也可手动切换。

## 本地运行

需要 Node.js 18 或更高版本。

```bash
npm install
npm run dev
```

然后打开 http://localhost:5173

## 命令

| 命令              | 作用                               |
| ----------------- | ---------------------------------- |
| `npm run dev`     | 开发服务器，改源码自动刷新         |
| `npm run build`   | 构建到 `dist/`                     |
| `npm run preview` | 本地预览构建产物                   |
| `npm run pack`    | 构建并打成 zip，收件人无需 Node.js |

`npm run pack` 生成的包里带一个只依赖系统自带运行时的启动器。
这一步是必要的: 构建产物用 `<script type="module">`，浏览器对 `file://` 下的模块脚本执行 CORS 检查，双击 `index.html` 打不开，收件人手上必须有个 HTTP 服务。

## 部署

`dist/` 是纯静态文件，`vite.config.ts` 里 `base: './'`，
产物内全是相对路径引用，没有前端路由，不需要 `404.html` 兜底。

## 技术栈

React 18 + TypeScript + Vite。运行时依赖只有 `js-yaml` (生成配方 YAML) 
和 `fflate` (导出工作区压缩包) ，没有 UI 框架和状态管理库。

## 许可

与 Craftorithm 主项目一致。
