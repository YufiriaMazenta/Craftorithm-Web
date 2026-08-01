import { useI18n } from "../i18n";
import type { MessageKey } from "../i18n";

/** 名称走 footer.link.<id>，地址不随语言变化。 */
const LINKS: { id: string; href: string }[] = [
  {
    id: "spigot",
    href: "https://www.spigotmc.org/resources/%E2%9C%A8craftorithm-1-13-1-21-%E2%9A%99%EF%B8%8Fcustomize-your-crafting-system%E2%9A%99%EF%B8%8F-%E2%9A%A1folia-support%E2%9A%A1.108429/",
  },
  { id: "modrinth", href: "https://modrinth.com/plugin/craftorithm" },
  { id: "wiki", href: "https://yufiriamazenta.github.io/Craftorithm-Docs/" },
  { id: "qq", href: "https://qm.qq.com/q/zvh7nW40eW" },
  { id: "discord", href: "https://discord.gg/kpaDxU2RyV" },
];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="app-footer" aria-label={t("footer.aria")}>
      <span className="footer-credit">{t("footer.credit")}</span>
      <nav className="footer-links">
        {LINKS.map((link) => (
          <a
            key={link.id}
            className="footer-link"
            href={link.href}
            /* 外链新开标签；noreferrer 一并阻断 window.opener */
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(`footer.link.${link.id}` as MessageKey)}
          </a>
        ))}
      </nav>
    </footer>
  );
}
