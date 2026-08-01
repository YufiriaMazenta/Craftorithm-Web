/**
 * 窄屏（<768px）实测：触控目标尺寸、横向溢出、分步导航可见性。
 *
 * 用本机已有的 Chromium 走 CDP，不额外装依赖。Node 22+ 自带 WebSocket。
 * 用法：node scripts/check-narrow.mjs <url> [宽] [高]
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
const width = Number(process.argv[3] ?? 390);
const height = Number(process.argv[4] ?? 844);
const PORT = 9333;

const profile = mkdtempSync(join(tmpdir(), 'cdp-'));
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
  mobile: true,
});
await send('Page.navigate', { url });
await sleep(2500);

// 第 4 个参数给 "triggers" 时先建一个触发器文件页并建一条，用于检查脚本编辑器
if (process.argv[5] === 'triggers') {
  // 视图行已合并进页签条，触发器文件从新建菜单里开
  await evaluate(`(() => {
    const more = document.querySelector('.tab-new-more');
    if (!more) return false;
    more.click();
    return true;
  })()`);
  await sleep(300);
  await evaluate(`(() => {
    const item = [...document.querySelectorAll('.tab-menu button')][0];
    if (item) item.click();
    return true;
  })()`);
  await sleep(500);
  await evaluate(`(() => {
    const btn = [...document.querySelectorAll('.panel button')][0];
    if (btn) btn.click();
    return true;
  })()`);
  await sleep(600);
  await evaluate(`(() => {
    const ta = document.querySelectorAll('.script-input')[1];
    if (!ta) return false;
    const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    set.call(ta, 'if level >= 10\\n  tell("&aok")\\nendif');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(400);
}

/*
 * 语言浮层默认收起，不展开就量不到里面的选项。
 * 放在最后展开：前面的点击（切视图、建触发器）都会触发外部 pointerdown 把它关掉。
 */
await evaluate(`(() => {
  const btn = document.querySelector('.lang-menu button');
  if (btn) btn.click();
  return true;
})()`);
await sleep(300);

const report = await evaluate(`(() => {
  const MIN = 44;
  const small = [];
  document.querySelectorAll('button,a,input,select,textarea,[role=button]').forEach((el) => {
    if (el.getAttribute('aria-hidden') === 'true' || el.tabIndex === -1) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.width < MIN || r.height < MIN) {
      small.push({
        cls: el.className || el.tagName,
        label: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 16),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
      });
    }
  });
  const de = document.documentElement;
  const stepTabs = document.querySelector('.step-tabs');
  const topbar = document.querySelector('.topbar');
  return {
    viewport: { w: innerWidth, h: innerHeight },
    horizontalOverflow: de.scrollWidth > de.clientWidth,
    scrollW: de.scrollWidth,
    clientW: de.clientWidth,
    topbarHeight: topbar ? +topbar.getBoundingClientRect().height.toFixed(1) : null,
    stepTabsVisible: stepTabs ? getComputedStyle(stepTabs).display !== 'none' : false,
    stepTabsStickyTop: stepTabs ? getComputedStyle(stepTabs).top : null,
    stepTabHeight: document.querySelector('.step-tab')
      ? +document.querySelector('.step-tab').getBoundingClientRect().height.toFixed(1)
      : null,
    guiSlot: document.querySelector('.gui-slot')
      ? (() => { const r = document.querySelector('.gui-slot').getBoundingClientRect();
          return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; })()
      : null,
    undersized: small,
  };
})()`);

console.log(JSON.stringify(report, null, 2));

ws.close();
chrome.kill();
process.exit(report.undersized.length === 0 && !report.horizontalOverflow ? 0 : 1);
