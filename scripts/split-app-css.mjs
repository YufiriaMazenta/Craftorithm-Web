/*
 * 一次性工具：把 app.css 按已有的 `/* ---- 分区 ---- *\/` 注释拆成多个文件。
 *
 * 拆分必须严格保序：app.css 里有几处选择器跨分区重开（.lang-panel 在「语言菜单」
 * 定义外观、又在「动画」里追加 animation），靠的是后写覆盖前写。因此入口文件
 * 按原顺序 @import，任何重排都会改变层叠结果。
 *
 * 本脚本只做搬运，不改一个字节的声明内容；校验脚本负责证明这一点。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/*
 * 读基线而不是 src/app.css：拆分完成后 app.css 就变成 @import 入口，
 * 再对它跑一次会匹配到 0 个分区。基线是唯一稳定的输入。
 */
const SRC = 'src/app.css.orig';
const OUT_DIR = 'src/styles';

// 分区注释 -> 目标文件名。顺序即 @import 顺序，也就是原文件里的出现顺序。
const NAMES = new Map([
  ['应用骨架', 'app-shell'],
  ['按钮', 'buttons'],
  ['语言菜单', 'language-menu'],
  ['三栏布局', 'layout'],
  ['左栏：类型导航', 'type-nav'],
  ['中央工作台', 'workbench'],
  ['GUI 贴图工作台', 'gui-bench'],
  ['槽位', 'slots'],
  ['字段', 'fields'],
  ['右栏：结果与校验', 'results'],
  ['物品选择浮层', 'picker'],
  ['页脚', 'footer'],
  ['提示条', 'toast'],
  ['移动端分步导航', 'mobile-steps'],
  ['响应式', 'responsive'],
  ['离线提示', 'catalog-status'],
  ['切换栏', 'tab-bar'],
  ['撤销 / 重做', 'tab-history'],
  ['新建入口（分裂按钮）', 'tab-new'],
  ['启动页', 'start-screen'],
  ['标签 / 物品组徽标', 'choice-badge'],
  ['物品组编辑器', 'pack-editor'],
  ['触发器编辑器', 'trigger-editor'],
  ['选择器页签', 'picker-tabs'],
  ['动画', 'animation'],
  ['脚本编辑器', 'script-editor'],
  ['参数提示浮窗', 'script-signature'],
  ['补全候选', 'script-complete'],
  ['校验结果', 'script-issues'],
]);

const raw = readFileSync(SRC, 'utf8');

/*
 * url() 里的相对路径必须重写。
 *
 * 原 app.css 在 src/ 下，`../assets/icons/x.svg` 指向 Web/assets/icons/x.svg。
 * 分区文件在 src/styles/ 下，同一个字符串就少了一级，Vite 解析不到资源 ——
 * 症状不是报错而是静默降级：图标不再被哈希进 dist/assets，产物里留下
 * 原样路径，线上 5 个 mask 图标全部 404。
 *
 * 改成根绝对路径而不是补一级 `../`：这样与文件在 src/ 下的深度无关，
 * 以后再拆一层或移动文件都不会重新踩到同一个坑。Vite 把以 / 开头的
 * url() 按项目根解析，Web/assets/... 正是根下的真实路径。
 */
const REL_ASSET = /url\("\.\.\/assets\//g;
const relCount = (raw.match(REL_ASSET) || []).length;
const text = raw.replace(REL_ASSET, 'url("/assets/');

const lines = text.split('\n');

const marker = /^\/\* ---- (.+?) ---- \*\/$/;
const sections = [];
lines.forEach((line, index) => {
  const hit = line.match(marker);
  if (hit) sections.push({ title: hit[1].trim(), start: index });
});

if (sections.length !== NAMES.size) {
  console.error(`分区数不符：文件里 ${sections.length}，映射表 ${NAMES.size}`);
  process.exit(1);
}

// 首个分区之前的内容（文件头注释等）必须为空，否则会被丢掉
const preamble = lines.slice(0, sections[0].start).join('\n');
if (preamble.trim()) {
  console.error('首个分区之前存在内容，拆分会丢失它：\n' + preamble);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const written = [];
sections.forEach((section, i) => {
  const end = i + 1 < sections.length ? sections[i + 1].start : lines.length;
  const name = NAMES.get(section.title);
  if (!name) {
    console.error(`分区「${section.title}」没有对应文件名`);
    process.exit(1);
  }
  /*
   * 连同分区注释一起搬过去，文件内仍保留它作为标题。
   *
   * 末尾统一收敛成一个换行：原文件里分区之间的空行数并不一致（26 处有空行，
   * 「三栏布局」与「页脚」之前没有）。统一后拼回时用空字符串连接即可复原，
   * 校验脚本因此能做严格的逐字节比较，而不必靠模糊化空白来蒙过去。
   */
  const body = lines.slice(section.start, end).join('\n');
  writeFileSync(join(OUT_DIR, `${name}.css`), body.replace(/\s*$/, '') + '\n');
  written.push({ name, title: section.title, lines: end - section.start });
});

const entry = [
  '/*',
  ' * app.css 的入口：只负责按原顺序引入分区文件。',
  ' *',
  ' * @import 顺序等于原 app.css 里的分区顺序，不能重排 —— 有几处选择器',
  ' * 跨分区重开（例如 .lang-panel 在 language-menu 定义外观、在 animation',
  ' * 追加 animation），靠后写覆盖前写生效。',
  ' *',
  ' * 拆分由 scripts/split-app-css.mjs 生成，一致性由',
  ' * scripts/verify-css-split.mjs 断言（拼回后必须与原文件逐字节相同）。',
  ' */',
  ...written.map((w) => `@import './styles/${w.name}.css';`),
  '',
].join('\n');

writeFileSync('src/app.css.new', entry);

console.log(`拆出 ${written.length} 个文件：`);
for (const w of written) console.log(`  ${String(w.lines).padStart(5)} 行  ${w.name}.css  (${w.title})`);
console.log(`\n重写 ${relCount} 处 url("../assets/ → url("/assets/（见脚本内说明）`);
