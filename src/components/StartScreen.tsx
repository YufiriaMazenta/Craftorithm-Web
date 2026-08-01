import { useRef } from 'react';
import { useI18n } from '../i18n';

interface StartScreenProps {
  onNewRecipe: () => void;
  onImportFiles: (files: File[]) => void;
}

/**
 * 没有任何打开的文件时显示的启动页。
 *
 * 三个入口：新建、导入单个/多个文件、导入整个文件夹。
 * 目录选择用 webkitdirectory —— showDirectoryPicker 只有 Chromium 有，
 * 而这里只需要读，不需要写回权限，webkitdirectory 在所有目标浏览器上都能用。
 */
export function StartScreen({ onNewRecipe, onImportFiles }: StartScreenProps) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const dirRef = useRef<HTMLInputElement>(null);

  function pick(input: HTMLInputElement | null) {
    input?.click();
  }

  return (
    <div className="start-screen">
      <div className="start-card">
        <h2 className="start-title">{t('start.title')}</h2>
        <p className="start-note">{t('start.note')}</p>
        <div className="start-actions">
          <button type="button" className="btn btn-primary" onClick={onNewRecipe}>
            {t('start.newRecipe')}
          </button>
          <button type="button" className="btn" onClick={() => pick(fileRef.current)}>
            {t('start.importFiles')}
          </button>
          <button type="button" className="btn" onClick={() => pick(dirRef.current)}>
            {t('start.importFolder')}
          </button>
        </div>
        <p className="start-hint">{t('start.hint')}</p>
      </div>

      {/*
        两个隐藏 input：一个多选文件，一个选目录。
        与顶栏那个导入入口一样用 sr-only + aria-hidden + tabIndex=-1，
        否则键盘会 Tab 到看不见也没有名字的控件上。
      */}
      <input
        ref={fileRef}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        type="file"
        multiple
        accept=".yml,.yaml"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onImportFiles(files);
          event.target.value = '';
        }}
      />
      <input
        ref={dirRef}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        type="file"
        /* React 不认识这两个属性名，用扩展属性绕过类型检查 */
        {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
        onChange={(event) => {
          /*
           * 目录选择会把整棵树的文件都交上来，包含 config.yml 之类
           * 与本编辑器无关的东西。这里只挑 .yml / .yaml，
           * 具体是配方还是触发器由解析阶段判断。
           */
          const files = Array.from(event.target.files ?? []).filter((file) =>
            /\.ya?ml$/i.test(file.name),
          );
          if (files.length > 0) onImportFiles(files);
          event.target.value = '';
        }}
      />
    </div>
  );
}
