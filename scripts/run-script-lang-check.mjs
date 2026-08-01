/**
 * 跑 verify-script-lang.ts 的封装脚本。
 *
 * 项目没有装测试运行器，这里用自带的 typescript 把 TS 编到临时目录再用 node 跑。
 * tsc 输出的相对 import 不带扩展名，Node ESM 需要补 .js，因此编完做一次改写。
 *
 * 用法：node scripts/run-script-lang-check.mjs
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const outDir = join(root, '.tmp-script-check');

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
      '--skipLibCheck',
      '--strict',
      join('scripts', 'verify-script-lang.ts'),
    ],
    { cwd: root, stdio: 'pipe' },
  );
} catch (error) {
  // 断言脚本里用了 process.exit，缺 @types/node 会报 TS2580，属预期噪声
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  const real = output
    .split('\n')
    .filter((line) => line.trim() && !line.includes('TS2580'));
  if (real.length > 0) {
    console.error('编译失败：');
    console.error(real.join('\n'));
    process.exit(1);
  }
}

/** 递归给相对 import 补 .js，单双引号都要覆盖。 */
function patch(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      patch(full);
      continue;
    }
    if (!name.endsWith('.js')) continue;
    const source = readFileSync(full, 'utf8');
    const patched = source.replace(
      /(from\s+)(['"])(\.[^'"]*?)\2/g,
      (_match, from, quote, path) =>
        `${from}${quote}${path.endsWith('.js') ? path : `${path}.js`}${quote}`,
    );
    if (patched !== source) writeFileSync(full, patched);
  }
}

patch(outDir);

try {
  execFileSync(process.execPath, [join(outDir, 'scripts', 'verify-script-lang.js')], {
    cwd: root,
    stdio: 'inherit',
  });
} catch {
  rmSync(outDir, { recursive: true, force: true });
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
