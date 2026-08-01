/**
 * 把整个工作区打包成 zip，目录结构与插件的数据目录一致：
 *   recipes/<name>.yml
 *   item_packs.yml
 *   triggers/<name>.yml
 *
 * 用 fflate 的同步 zipSync：工作区规模是几十个小文本文件，
 * 异步版本要多管一个回调却省不下什么时间。
 */
import { zipSync, strToU8 } from 'fflate';
import { draftFileName, draftToYaml, itemPacksToYaml, triggersToYaml } from './recipeSerializer';
import type { Workspace } from './workspace';

/** zip 内的路径 → 文本内容。导出前可以先看一眼都会写出什么。 */
export function buildWorkspaceFiles(workspace: Workspace): Map<string, string> {
  const files = new Map<string, string>();
  // 同名文件会互相覆盖，因此逐个去重：a.yml 撞名后变 a-2.yml
  const used = new Set<string>();

  for (const tab of workspace.tabs) {
    if (tab.kind === 'recipe') {
      const path = uniquePath(`recipes/${draftFileName(tab.draft)}`, used);
      files.set(path, draftToYaml(tab.draft));
    } else {
      const base = tab.fileName.trim() || 'triggers';
      const path = uniquePath(`triggers/${base.replace(/\.ya?ml$/i, '')}.yml`, used);
      files.set(path, triggersToYaml(tab.triggers));
    }
  }

  // 没有物品组时不写空文件：插件读到空的 item_packs.yml 没意义
  if (workspace.itemPacks.length > 0) {
    files.set('item_packs.yml', itemPacksToYaml(workspace.itemPacks));
  }

  return files;
}

function uniquePath(path: string, used: Set<string>): string {
  if (!used.has(path)) {
    used.add(path);
    return path;
  }
  const dot = path.lastIndexOf('.');
  const stem = dot === -1 ? path : path.slice(0, dot);
  const ext = dot === -1 ? '' : path.slice(dot);
  let n = 2;
  let candidate = `${stem}-${n}${ext}`;
  while (used.has(candidate)) {
    n += 1;
    candidate = `${stem}-${n}${ext}`;
  }
  used.add(candidate);
  return candidate;
}

/** 打包并触发下载。返回写出的文件数，供提示文案用。 */
export function downloadWorkspaceZip(workspace: Workspace, zipName = 'craftorithm'): number {
  const files = buildWorkspaceFiles(workspace);
  if (files.size === 0) return 0;

  const payload: Record<string, Uint8Array> = {};
  for (const [path, text] of files) {
    payload[path] = strToU8(text);
  }

  const zipped = zipSync(payload, { level: 6 });
  /*
   * 复制到新的 ArrayBuffer 再造 Blob：fflate 返回的 Uint8Array 可能是
   * 更大缓冲区上的视图，直接塞给 Blob 会把多余字节也写进文件。
   */
  const bytes = new Uint8Array(zipped.length);
  bytes.set(zipped);
  const blob = new Blob([bytes], { type: 'application/zip' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${zipName}.zip`;
  link.click();
  URL.revokeObjectURL(url);

  return files.size;
}
