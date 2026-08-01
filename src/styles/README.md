# src/styles/

`app.css` 拆分后的分区文件。**这些是生成物，不要手改。**

## 怎么改样式

改 `src/app.css.orig`（拆分前的完整文件），然后重新生成：

```bash
node scripts/split-app-css.mjs   # 从 .orig 重新拆出 28 个分区文件
node scripts/verify-css-split.mjs # 断言拼回后与 .orig 等价
```

直接改 `src/styles/*.css` 会在下次运行拆分脚本时被覆盖，而且会让
`verify-css-split.mjs` 失败 —— 那个脚本的作用正是证明分区文件与基线一致。

## 为什么保留 app.css.orig

它是校验脚本的基线。没有它就无法证明「拆分只是搬运，没有改样式」，
`verify-css-split.mjs` 会直接 SKIP。

## 为什么入口的 @import 顺序不能重排

有几处选择器跨分区重开，靠后写覆盖前写：

- `.lang-panel` 在 `language-menu.css` 定义外观，在 `animation.css` 追加 `animation`
- `.picker-backdrop`、`.toast` 同理

重排 `@import` 会改变层叠结果。

## url() 用根绝对路径

分区文件比原 `app.css` 深一级，`url("../assets/...")` 在这里解析不到 ——
症状不是报错而是静默降级：Vite 不再把图标哈希进 `dist/assets/`，产物里留下
原样路径，线上 mask 图标全部 404。

因此拆分脚本把 `url("../assets/` 重写为 `url("/assets/`，与文件深度无关。
`verify-css-split.mjs` 承认这一处差异，并在有人把它改回相对写法时报错。
