/**
 * 把构建产物打成可以直接发给别人部署的发布包。
 *
 * 解决的问题：dist/ 是纯静态文件，但不能靠双击 index.html 打开 ——
 * 构建产物用 <script type="module">，浏览器对 file:// 下的模块脚本执行
 * CORS 检查，会直接拒绝加载。所以收件人手上必须有一个 HTTP 服务。
 * 因此包里除了静态文件，还带一个只依赖系统自带运行时的启动器。
 *
 * 不打包 node_modules / 源码 / 配置：收件人不需要 Node，也不需要构建。
 * 包内启动器只用 Python 标准库或 Windows 自带的 PowerShell。
 *
 * 用 fflate 的 zipSync：它已经是 exportWorkspace 的依赖，不额外引包。
 * 发布包是几十个小文件加起来不到 1MB，同步压缩的耗时可以忽略。
 *
 * 用法：node scripts/pack-release.mjs [--out <目录>]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { zipSync, strToU8 } from 'fflate';

const root = join(import.meta.dirname, '..');
const distDir = join(root, 'dist');
const templateDir = join(import.meta.dirname, 'release-template');

const outFlag = process.argv.indexOf('--out');
const outDir = outFlag === -1 ? join(root, 'release') : process.argv[outFlag + 1];

if (!existsSync(distDir)) {
  console.error('找不到 dist/。请先执行 npm run build。');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

/** 递归收集目录下所有文件，返回 [zip 内相对路径, 内容] 对。 */
function collect(dir, prefix) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...collect(full, `${prefix}${name}/`));
      continue;
    }
    // zip 内一律用正斜杠，Windows 的反斜杠会让解压工具建出名字含 \ 的文件
    entries.push([`${prefix}${relative(dir, full).split(sep).join('/')}`, readFileSync(full)]);
  }
  return entries;
}

const files = {};

// 静态产物放在包内 site/ 子目录，与启动器分开，收件人一眼看出哪些是网站文件
for (const [path, content] of collect(distDir, 'site/')) {
  files[path] = content;
}

// 启动器与说明来自 scripts/release-template/，内容不随构建变化
for (const [path, content] of collect(templateDir, '')) {
  files[path] = content;
}

/*
 * serve.ps1 必须带 UTF-8 BOM：Windows PowerShell 5.1 读无 BOM 的 .ps1 时
 * 按 ANSI 解码，里面的中文提示会变成乱码，而收件人只看得到乱码看不到原因。
 * 编辑器另存时很容易把 BOM 丢掉，所以在打包这一步卡住，而不是等收件人反馈。
 */
const ps1 = files['serve.ps1'];
if (!ps1) {
  console.error('release-template 里缺少 serve.ps1。');
  process.exit(1);
}
if (!(ps1[0] === 0xef && ps1[1] === 0xbb && ps1[2] === 0xbf)) {
  console.error('serve.ps1 缺少 UTF-8 BOM，PowerShell 5.1 下中文会乱码。');
  console.error('请用「UTF-8 with BOM」重新保存 scripts/release-template/serve.ps1。');
  process.exit(1);
}

/*
 * start.bat 必须是纯 ASCII，理由与主目录那份相同：cmd.exe 每执行一条命令
 * 就按字节偏移重读文件，非 ASCII 字节遇上代码页切换会让偏移错位，
 * 于是它会从某一行中间开始执行，报出莫名其妙的命令找不到。
 */
const bat = files['start.bat'];
if (bat && bat.some((byte) => byte > 0x7f)) {
  console.error('start.bat 含非 ASCII 字节，cmd.exe 可能执行到行中间。');
  console.error('请把所有中文提示放进 serve.ps1。');
  process.exit(1);
}

/*
 * 版本号写进包内一个纯文本文件，便于收件人核对拿到的是哪一版。
 * 不写进 index.html：那是构建产物，改它等于让发布包与本地预览不一致。
 */
const stamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
files['VERSION.txt'] = strToU8(
  [
    `Craftorithm Recipe Studio ${pkg.version}`,
    `打包时间: ${stamp}`,
    '',
    '这是构建好的生产版本，不含源码与 node_modules。',
    '启动方式见 README.txt。',
    '',
  ].join('\n'),
);

const zipped = zipSync(files, { level: 9 });

mkdirSync(outDir, { recursive: true });
const zipName = `craftorithm-recipe-studio-${pkg.version}.zip`;
const zipPath = join(outDir, zipName);
writeFileSync(zipPath, zipped);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(`发布包已生成: ${zipPath}`);
console.log(`  文件数: ${Object.keys(files).length}`);
console.log(`  压缩后: ${kb(zipped.length)}`);
