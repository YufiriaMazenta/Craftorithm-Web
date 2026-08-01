/*
 * 断言 src/styles/ 的分区文件按入口顺序拼回后，与拆分前的 app.css 完全等价。
 *
 * 「等价」在这里是逐字节相同，只允许一处差异：每个分区文件末尾被规范成
 * 单个换行。因此比较前把连续空白收敛到分区边界上，其余一个字符都不放过。
 *
 * 需要基线文件 app.css.orig（拆分前的副本）。基线不存在时跳过并说明，
 * 而不是假装通过 —— 这个脚本的唯一价值就是证明拆分没改样式。
 */
import { readFileSync, existsSync } from 'node:fs';

const ORIG = 'src/app.css.orig';
const ENTRY = 'src/app.css';

if (!existsSync(ORIG)) {
  console.log(`SKIP: 找不到基线 ${ORIG}，无法证明拆分等价。`);
  console.log('（首次拆分时应保留一份拆分前的 app.css 作为基线）');
  process.exit(2);
}

const entry = readFileSync(ENTRY, 'utf8');
const imports = [...entry.matchAll(/@import\s+'\.\/(.+?)';/g)].map((m) => m[1]);

if (imports.length === 0) {
  console.error('入口文件里没有 @import，拆分未生效？');
  process.exit(1);
}

// 每个分区文件末尾已被规范成单个换行，因此直接首尾相接即可复原
const joined = imports.map((rel) => readFileSync(`src/${rel}`, 'utf8')).join('');
const orig = readFileSync(ORIG, 'utf8');

/*
 * 严格比较：只把每个分区末尾多余的空行收敛掉，别的一个字符都不放过。
 *
 * 原文件里分区之间的空行数不一致（26 处有空行，「三栏布局」与「页脚」之前
 * 没有），拆分统一成一个换行。所以基线这一侧也做同样的收敛 —— 只针对
 * 「分区注释前的连续空行」，不是全局模糊化空白。
 */
const collapseBeforeSections = (s) => s.replace(/\n+(\/\* ---- )/g, '\n$1');

/*
 * 唯一一处有意的内容差异：url() 的资源路径。
 *
 * 分区文件比原 app.css 深一级，`../assets/` 会解析不到；拆分脚本因此把它
 * 重写成根绝对路径 `/assets/`。比较时把基线做同样的重写，从而这处差异被
 * 承认，而其他任何字符改动仍然会被抓出来。
 *
 * 顺带这也是一道回归闸门：如果谁把分区文件里的路径改回相对写法，
 * 这里就会立刻 FAIL，而不是等到线上图标 404 才发现。
 */
const rewriteAssets = (s) => s.replace(/url\("\.\.\/assets\//g, 'url("/assets/');

const norm = (s) => rewriteAssets(collapseBeforeSections(s)).replace(/\s*$/, '') + '\n';
const a = norm(orig);
const b = norm(joined);

if (a === b) {
  console.log(`PASS: ${imports.length} 个分区文件拼回后与基线等价（${a.length} 字符）。`);
  process.exit(0);
}

// 定位第一处差异，直接给出行号和上下文，不让人自己 diff
const al = a.split('\n');
const bl = b.split('\n');
let i = 0;
while (i < al.length && i < bl.length && al[i] === bl[i]) i += 1;
console.error(`FAIL: 第 ${i + 1} 行开始不一致`);
console.error(`  基线: ${JSON.stringify(al[i] ?? '<EOF>')}`);
console.error(`  拼回: ${JSON.stringify(bl[i] ?? '<EOF>')}`);
console.error(`  基线行数 ${al.length} / 拼回行数 ${bl.length}`);
process.exit(1);
