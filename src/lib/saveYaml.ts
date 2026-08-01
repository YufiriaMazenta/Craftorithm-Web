/**
 * 导出 YAML 的统一出口。
 *
 * 优先弹系统保存对话框（File System Access API），用户可以直接选到服务器的
 * 插件目录，省掉「先下载再搬文件」这一步。同一个 id 的 picker 会记住上次的
 * 目录，第二次导出直接落在同一个地方。
 *
 * 浏览器不允许页面静默写任意路径，所以做不到「配置里填死一个目录」，
 * 能做到的就是「弹框 + 记住上次位置」。
 *
 * API 不可用时（Firefox / Safari，或非安全上下文如 file://）回落到
 * <a download>，行为和改造前完全一致。
 */

export type SaveOutcome =
  /** 用户在系统对话框里选了位置并写入成功 */
  | "saved"
  /** 回落到浏览器下载目录 */
  | "downloaded"
  /** 用户取消了保存对话框 */
  | "cancelled";

/** File System Access API 在 lib.dom 里还没有类型，按用到的部分自己声明。 */
interface SaveFilePickerOptions {
  suggestedName?: string;
  id?: string;
  startIn?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}

interface FileSystemWritable {
  write(data: string): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandleLike {
  createWritable(): Promise<FileSystemWritable>;
}

type SaveFilePicker = (
  options?: SaveFilePickerOptions,
) => Promise<FileSystemFileHandleLike>;

function pickerFn(): SaveFilePicker | null {
  const fn = (window as unknown as { showSaveFilePicker?: SaveFilePicker })
    .showSaveFilePicker;
  return typeof fn === "function" ? fn : null;
}

/** 回落路径：造一个临时 <a download> 点一下。 */
function downloadFallback(name: string, text: string) {
  const blob = new Blob([text], { type: "text/yaml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function saveYamlFile(
  name: string,
  text: string,
): Promise<SaveOutcome> {
  const showSaveFilePicker = pickerFn();
  if (!showSaveFilePicker) {
    downloadFallback(name, text);
    return "downloaded";
  }

  try {
    const handle = await showSaveFilePicker({
      suggestedName: name,
      // 固定 id 让浏览器记住上次选的目录
      id: "craftorithm-yaml",
      startIn: "documents",
      types: [{ accept: { "text/yaml": [".yml"] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
    return "saved";
  } catch (error) {
    // 用户点了取消：什么都没发生，也不该提示
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    // 其他失败（权限、磁盘）就退回下载，别让用户拿不到文件
    downloadFallback(name, text);
    return "downloaded";
  }
}
