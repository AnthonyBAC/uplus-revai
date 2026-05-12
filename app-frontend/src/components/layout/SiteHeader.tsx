import Link from "next/link";
import { ArrowLeft, LogIn } from "lucide-react";
import BrandLogo from "./BrandLogo";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps =
  | {
      mode: "marketing";
    }
  | {
      mode: "simple";
      backHref: string;
      backLabel: string;
    };

const marketingLabels = ["Producto", "Cómo funciona", "Precios", "Casos"];

export default function SiteHeader(props: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <BrandLogo variant="pastel" />
        </Link>

        {props.mode === "marketing" ? (
          <nav className={styles.nav} aria-label="Navegación principal">
            {marketingLabels.map((label) => (
              <span key={label} className={styles.navItem}>
                {label}
              </span>
            ))}
          </nav>
        ) : null}

        {props.mode === "marketing" ? (
          <div className={styles.actions}>
            <Link href="/login" className={styles.linkButton}>
              Login
            </Link>
            <Link href="/demo" className={styles.primaryButton}>
              <LogIn size={16} />
              Ir a demo
            </Link>
          </div>
        ) : (
          <div className={styles.back}>
            <Link href={props.backHref} className={styles.backLink}>
              <ArrowLeft size={16} />
              {props.backLabel}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
