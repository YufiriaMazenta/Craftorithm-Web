/**
 * 跑 verify-trigger-types.ts 的封装脚本，写法沿用 run-recipe-draft-check.mjs。
 *
 * triggerTypes.ts 与 zh_cn.ts 都不 import 静态资源，所以这里其实用不上那份
 * png → 字符串常量的改写；仍保留同一个 patch 函数，是为了让四个 run-*.mjs
 * 保持同一套流程，将来断言牵进带 png 的模块时不必再改这里。
 *
 * 用法：node scripts/run-trigger-types-check.mjs
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const outDir = join(root, '.tmp-trigger-types-check');

rmSync(outDir, { recursive: true, force: true });

const tsc = join(root, 'node_modules', 'typescript', 'bin', 'tsc');

try {
  execFileSync(
    process.execPath,
    [
      tsc,
      '--outDir', outDir,
      '--module', 'esnext',
      '--target', 'es2022',
      '--moduleResolution', 'bundler',
      '--types', 'vite/client',
      '--skipLibCheck',
      '--strict',
      '--resolveJsonModule',
      join('scripts', 'verify-trigger-types.ts'),
    ],
    { cwd: root, stdio: 'pipe' },
  );
} catch (error) {
  // 断言脚本里用了 process.exit，缺 @types/node 会报 TS2580/TS2591，属预期噪声
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  const real = output
    .split('\n')
    .filter((line) => line.trim() && !line.includes('TS2580') && !line.includes('TS2591'));
  if (real.length > 0) {
    console.error('编译失败：');
    console.error(real.join('\n'));
    process.exit(1);
  }
}

/** 递归给相对 import 补 .js，并把静态资源 import 换成字符串常量。 */
function patch(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      patch(full);
      continue;
    }
    if (!name.endsWith('.js')) continue;
    const source = readFileSync(full, 'utf8');
    let patched = source.replace(
      /import\s+(\w+)\s+from\s+(['"])([^'"]*\.(?:png|jpe?g|svg|webp|gif))\2;?/g,
      (_match, binding, quote, path) => `const ${binding} = ${quote}${path}${quote};`,
    );
    patched = patched.replace(
      /(from\s+)(['"])(\.[^'"]*?)\2/g,
      (_match, from, quote, path) =>
        `${from}${quote}${path.endsWith('.js') ? path : `${path}.js`}${quote}`,
    );
    if (patched !== source) writeFileSync(full, patched);
  }
}

patch(outDir);

try {
  execFileSync(process.execPath, [join(outDir, 'scripts', 'verify-trigger-types.js')], {
    cwd: root,
    stdio: 'inherit',
  });
} catch {
  rmSync(outDir, { recursive: true, force: true });
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
