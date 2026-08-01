/**
 * 视图切换的转场封装。
 *
 * 顶部三个视图与窄屏三步骤切换的是整块工作区。默认行为是新旧内容原地
 * 瞬间替换，没有「换了一屏」的交接感。这里用 View Transitions API 让新旧
 * 两帧交叉溶解，具体动画写在 app.css 的 ::view-transition-* 里。
 *
 * 不做方向性位移：横向推移在这个工具里读起来像顿一下，而三个视图是并列
 * 关系，本来也没有「哪边更靠前」。
 *
 * 不支持该 API 的浏览器（当前主要是 Firefox）直接执行 update，
 * 退回原本的瞬间替换：转场是增强，不承载任何功能。
 */

/**
 * startViewTransition 在部分 TS DOM 版本里还没有声明，
 * 因此按可选成员单独描述，而不是断言成 any。
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

/** 减少动态偏好下不做转场，交给系统设置说话。 */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 执行一次带转场的状态更新。
 *
 * @param update 真正的 setState 调用。必须同步完成，React 才能在这一帧里提交。
 */
export function transitionView(update: () => void): void {
  const doc = document as ViewTransitionDocument;

  if (typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) {
    update();
    return;
  }

  doc.startViewTransition(update);
}
