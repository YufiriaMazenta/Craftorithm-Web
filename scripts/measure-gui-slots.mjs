/**
 * 从容器 GUI 贴图里量出槽位的像素坐标。
 *
 * 原版槽位内区是 16x16 的暗色方块，外侧有 1px 高亮边。这里只做纯像素扫描：
 * 找出所有 16x16 的同色暗块，再按左上角坐标聚类输出。
 * 结果用于在 UI 上把可点击槽位精确压在贴图原本的槽位上。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

const GUI_DIR = join(import.meta.dirname, '..', 'assets', 'gui');

function decodePng(buffer) {
  let offset = 8;
  const idat = [];
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let palette = null;
  let trns = null;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (data[12] !== 0) throw new Error('隔行扫描 PNG 不支持');
    } else if (type === 'PLTE') {
      palette = data;
    } else if (type === 'tRNS') {
      trns = data;
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  if (bitDepth !== 8) throw new Error(`只支持 8bit，实际 ${bitDepth}`);
  const raw = inflateSync(Buffer.concat(idat));
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`不支持的颜色类型 ${colorType}`);

  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);
  let pos = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[pos];
    pos += 1;
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const out = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    unfilter(filter, line, out, prev, channels);
  }

  return { width, height, channels, colorType, palette, trns, pixels, stride };
}

function unfilter(filter, line, out, prev, bpp) {
  for (let i = 0; i < line.length; i += 1) {
    const raw = line[i];
    const a = i >= bpp ? out[i - bpp] : 0;
    const b = prev ? prev[i] : 0;
    const c = prev && i >= bpp ? prev[i - bpp] : 0;
    let value;
    switch (filter) {
      case 0: value = raw; break;
      case 1: value = raw + a; break;
      case 2: value = raw + b; break;
      case 3: value = raw + ((a + b) >> 1); break;
      case 4: value = raw + paeth(a, b, c); break;
      default: throw new Error(`未知过滤器 ${filter}`);
    }
    out[i] = value & 0xff;
  }
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function pixelAt(img, x, y) {
  const i = y * img.stride + x * img.channels;
  return [img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]];
}

/**
 * 槽位内区是 16x16 的均匀暗块（原版为 #8B8B8B）。
 * 判定：该 16x16 区域内颜色完全一致，且比贴图主背景更暗。
 */
function findSlots(img) {
  const key = (x, y) => pixelAt(img, x, y).join(',');
  const found = [];
  const taken = new Set();

  for (let y = 0; y + 16 <= img.height; y += 1) {
    for (let x = 0; x + 16 <= img.width; x += 1) {
      if (taken.has(`${x},${y}`)) continue;
      const c = key(x, y);
      const [r, g, b, a] = pixelAt(img, x, y);
      if (a !== 255) continue;
      // 只认暗于背景的灰块
      if (r !== g || g !== b) continue;
      if (r > 160) continue;

      let uniform = true;
      for (let dy = 0; dy < 16 && uniform; dy += 1) {
        for (let dx = 0; dx < 16; dx += 1) {
          if (key(x + dx, y + dy) !== c) { uniform = false; break; }
        }
      }
      if (!uniform) continue;

      // 必须是极大块：左边一列和上边一行不能同色，否则是同一槽位的偏移命中
      if (x > 0 && key(x - 1, y) === c) continue;
      if (y > 0 && key(x, y - 1) === c) continue;

      found.push({ x, y, color: c });
      for (let dy = 0; dy < 16; dy += 1) {
        for (let dx = 0; dx < 16; dx += 1) taken.add(`${x + dx},${y + dy}`);
      }
    }
  }
  return found;
}

/**
 * 从检出的暗块向四周扩张，量出这个槽位实际的均匀区域尺寸。
 * 用于确认贴图上的槽位是不是标准 16x16，避免把图标压在偏移的位置。
 */
function measureExtent(img, slot) {
  const key = (x, y) => {
    const i = y * img.stride + x * img.channels;
    return `${img.pixels[i]},${img.pixels[i + 1]},${img.pixels[i + 2]},${img.pixels[i + 3]}`;
  };
  const c = slot.color;
  let right = slot.x;
  while (right + 1 < img.width && key(right + 1, slot.y) === c) right += 1;
  let bottom = slot.y;
  while (bottom + 1 < img.height && key(slot.x, bottom + 1) === c) bottom += 1;
  return { w: right - slot.x + 1, h: bottom - slot.y + 1 };
}

if (process.argv[1] && process.argv[1].endsWith('measure-gui-slots.mjs')) {
  for (const file of readdirSync(GUI_DIR).filter((n) => n.endsWith('.png'))) {
    const img = decodePng(readFileSync(join(GUI_DIR, file)));
    const slots = findSlots(img);
    console.log(`\n${file}  ${img.width}x${img.height}  找到 ${slots.length} 个候选槽位`);
    for (const s of slots) {
      const e = measureExtent(img, s);
      const flag = e.w === 16 && e.h === 16 ? '' : '   <= 非 16x16';
      console.log(
        `   x=${String(s.x).padStart(3)} y=${String(s.y).padStart(3)}  ${e.w}x${e.h}  rgba(${s.color})${flag}`,
      );
    }
  }
}
