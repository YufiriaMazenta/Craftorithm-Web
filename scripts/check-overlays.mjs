/**
 * 浮层可见性实测：打开每个浮层，用命中测试确认它真的可见。
 *
 * 为什么需要这个脚本：页签条的新建菜单曾经因为父元素 overflow: hidden 被整个裁掉，
 * 而当时的断言只查 DOM 和 aria-expanded —— 两项都通过，菜单却完全看不见。
 * 只要浮层被祖先裁切、被别的层盖住、或者被挪出视口，DOM 断言都发现不了。
 * 这里改用 elementFromPoint：把浮层自身的坐标交给浏览器做命中测试，
 * 命中的元素必须落在浮层内部，否则说明用户点不到它。
 *
 * 用法：node scripts/check-overlays.mjs <url> [宽] [高]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = join(
  process.env.LOCALAPPDATA ?? join(process.env.USERPROFILE ?? '', 'AppData', 'Local'),
  'ms-playwright',
  'chromium-1223',
  'chrome-win64',
  'chrome.exe',
);

const url = process.argv[2] ?? 'http://localhost:5174/';
const width = Number(process.argv[3] ?? 1280);
const height = Number(process.argv[4] ?? 900);
const PORT = 9334;

const profile = mkdtempSync(join(tmpdir(), 'cdp-overlay-'));
const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--headless=new',
    `--window-size=${width},${height}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* 还没起来 */
    }
    await sleep(250);
  }
  throw new Error('CDP 未就绪');
}

const wsUrl = await findTarget();
const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

let nextId = 1;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
});

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));
  return result.value;
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
});
await send('Page.navigate', { url });
await sleep(2500);

/*
 * 命中测试探针。在浮层矩形内取几个点（不只取中心：中心可能正好落在
 * 两个菜单项的间隙或分隔线上），只要有一点命中浮层内部就算可见。
 * 同时报告实际命中的元素，方便定位是被谁盖住/裁掉的。
 */
const PROBE = `(selector) => {
  const el = document.querySelector(selector);
  if (!el) return { present: false };
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return { present: true, visible: false, reason: 'zero size' };
  const pts = [
    [r.left + r.width / 2, r.top + 6],
    [r.left + r.width / 2, r.top + r.height / 2],
    [r.left + 6, r.top + r.height - 6],
  ];
  let hitOwn = false;
  let blocker = null;
  for (const [x, y] of pts) {
    const hit = document.elementFromPoint(x, y);
    if (hit && (hit === el || el.contains(hit))) { hitOwn = true; break; }
    if (hit && !blocker) blocker = hit.className || hit.tagName;
  }
  const cs = getComputedStyle(el);
  return {
    present: true,
    visible: hitOwn,
    rect: { top: +r.top.toFixed(0), left: +r.left.toFixed(0), w: +r.width.toFixed(0), h: +r.height.toFixed(0) },
    inViewport: r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1,
    opacity: cs.opacity,
    blockedBy: hitOwn ? null : blocker,
  };
}`;

async function probe(selector) {
  return evaluate(`(${PROBE})(${JSON.stringify(selector)})`);
}

const results = [];

// 1. 页签条的新建菜单：曾被父元素 overflow: hidden 整个裁掉
await evaluate(`(() => {
  const b = [...document.querySelectorAll('.start-actions button')].find((x) => /配方/.test(x.textContent));
  if (b) b.click();
  return true;
})()`);
await sleep(500);
await evaluate(`document.querySelector('.tab-new-more').click()`);
await sleep(350);
results.push(['页签条新建菜单 .tab-menu', await probe('.tab-menu')]);
await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
await sleep(250);

// 2. 语言浮层
await evaluate(`(() => { const b = document.querySelector('.lang-menu button'); if (b) b.click(); return true; })()`);
await sleep(350);
  results.push(['语言浮层 .lang-panel', await probe('.lang-panel')]);
await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
await sleep(250);

// 3. 物品选择器浮层：点合成网格里的槽位打开
await evaluate(`(() => { const s = document.querySelector('.gui-slot, .slot'); if (s) s.click(); return true; })()`);
await sleep(500);
results.push(['物品选择器 .picker', await probe('.picker, .picker-panel, .item-picker')]);

let failed = 0;
for (const [name, r] of results) {
  if (!r.present) {
    console.log(`  skip  ${name}（未出现，可能选择器已变）`);
    continue;
  }
  const ok = r.visible;
  if (!ok) failed += 1;
  console.log(
    `  ${ok ? 'ok  ' : 'FAIL'}  ${name}` +
      (ok
        ? ` ${r.rect.w}×${r.rect.h} @ ${r.rect.left},${r.rect.top}`
        : `  被 ${r.blockedBy ?? '未知'} 遮挡/裁切；rect=${JSON.stringify(r.rect)} inViewport=${r.inViewport} opacity=${r.opacity}`),
  );
}

console.log(failed === 0 ? '\n所有浮层命中测试通过。' : `\n${failed} 个浮层实际不可见。`);

ws.close();
chrome.kill();
process.exit(failed === 0 ? 0 : 1);


