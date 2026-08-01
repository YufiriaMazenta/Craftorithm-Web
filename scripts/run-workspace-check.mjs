/**
 * 跑 verify-workspace.ts 的封装脚本，写法沿用 run-recipe-draft-check.mjs。
 *
 * 同样要处理 data/recipeTypes.ts 的 png import：类型靠 vite/client 的
 * `declare module '*.png'`，运行期把这些 import 改写成字符串常量。
 * 另外这份断言会牵进 exportWorkspace.ts，它 import 了 fflate（真实依赖，
 * Node 能直接解析），所以不需要额外处理。
 *
 * 用法：node scripts/run-workspace-check.mjs
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const outDir = join(root, '.tmp-workspace-check');

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
      join('scripts', 'verify-workspace.ts'),
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
  execFileSync(process.execPath, [join(outDir, 'scripts', 'verify-workspace.js')], {
    cwd: root,
    stdio: 'inherit',
  });
} catch {
  rmSync(outDir, { recursive: true, force: true });
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
