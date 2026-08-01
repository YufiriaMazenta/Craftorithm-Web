import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n';

/** 导出的是哪一类文件，决定目标目录。 */
export type ExportKind = 'recipe' | 'trigger' | 'itemPacks';

interface ExportNextStepsProps {
  kind: ExportKind;
  /** 刚导出的文件名，原样回显用户看到的那个 */
  fileName: string;
  /** 走的是系统保存对话框还是浏览器下载目录，措辞不同 */
  outcome: 'saved' | 'downloaded';
  onDismiss: () => void;
  onNotify: (message: string) => void;
}

/**
 * 导出之后的「下一步」。
 *
 * 为什么要有这块：工具的终点是「文件进了下载目录」，用户的终点是
 * 「服务器上配方生效了」。中间隔着「放进插件目录 → reload → 确认生效」，
 * PRODUCT.md 把这一步写进了操作语境，而界面原来只给一条 2.6 秒的 toast，
 * 在用户最需要「我做对了吗」的那一秒沉默。
 *
 * 目录与命令都从插件源码核对过，不是猜的：
 *   recipes/     RecipeManager.RECIPE_FILE_FOLDER
 *   triggers/    TriggerManager
 *   item_packs.yml  ItemManager
 *   /craftorithm reload  ReloadCommand
 *
 * 它是常驻卡片而不是 toast：用户要照着它搬文件，读完还得能回头看。
 */
export function ExportNextSteps({
  kind,
  fileName,
  outcome,
  onDismiss,
  onNotify,
}: ExportNextStepsProps) {
  const { t } = useI18n();

  /* 物品组是固定的单个文件，另两类是目录下的一个文件 */
  const target =
    kind === 'itemPacks'
      ? 'plugins/Craftorithm/item_packs.yml'
      : `plugins/Craftorithm/${kind === 'recipe' ? 'recipes' : 'triggers'}/${fileName}`;

  const command = '/craftorithm reload';

  async function copyPath(text: string, okKey: MessageKey) {
    try {
      await navigator.clipboard.writeText(text);
      onNotify(t(okKey));
    } catch {
      onNotify(t('toast.copyFailed'));
    }
  }

  return (
    <section className="next-steps" aria-labelledby="next-steps-title">
      <div className="next-steps-head">
        <h3 className="next-steps-title" id="next-steps-title">
          {t(outcome === 'saved' ? 'next.titleSaved' : 'next.titleDownloaded', {
            name: fileName,
          })}
        </h3>
        <button
          type="button"
          className="btn btn-sm btn-quiet next-steps-close"
          onClick={onDismiss}
        >
          {t('next.done')}
        </button>
      </div>

      <ol className="next-steps-list">
        <li>
          <span className="next-steps-step">{t('next.step1')}</span>
          {/*
            路径用等宽体：它是要照着敲或粘贴的字符串，不是说明文字。
            复制按钮比「请手动复制」实用得多——这一步最常见的错误就是路径打错。
          */}
          <span className="next-steps-path">
            <code>{target}</code>
            <button
              type="button"
              className="btn btn-sm btn-quiet"
              onClick={() => void copyPath(target, 'next.pathCopied')}
            >
              {t('next.copyPath')}
            </button>
          </span>
        </li>
        <li>
          <span className="next-steps-step">{t('next.step2')}</span>
          <span className="next-steps-path">
            <code>{command}</code>
            <button
              type="button"
              className="btn btn-sm btn-quiet"
              onClick={() => void copyPath(command, 'next.commandCopied')}
            >
              {t('next.copyCommand')}
            </button>
          </span>
        </li>
        <li>
          <span className="next-steps-step">{t('next.step3')}</span>
        </li>
      </ol>
    </section>
  );
}
