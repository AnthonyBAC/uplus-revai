import Link from "next/link";
import { ArrowLeft, LogIn } from "lucide-react";
import BrandLogo from "./BrandLogo";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps =
  | {
      mode: "marketing";
      showCenterNav?: boolean;
    }
  | {
      mode: "simple";
      backHref: string;
      backLabel: string;
    };

const marketingLabels = ["Producto", "Cómo funciona", "Precios", "Casos"];

export default function SiteHeader(props: SiteHeaderProps) {
  const showCenterNav = props.mode === "marketing" && props.showCenterNav !== false;
  const useWideLayout = props.mode === "marketing" && !showCenterNav;

  return (
    <header className={styles.header}>
      <div className={useWideLayout ? `${styles.inner} ${styles.innerWithoutCenter}` : styles.inner}>
        <Link href="/" prefetch={false} className={styles.brand}>
          <BrandLogo variant="default" />
        </Link>

        {showCenterNav ? (
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
            <Link href="/login" prefetch={false} className={styles.linkButton}>
              Login
            </Link>
            <Link href="/demo" prefetch={false} className={styles.primaryButton}>
              <LogIn size={16} />
              Ir a demo
            </Link>
          </div>
        ) : (
          <div className={styles.back}>
            <Link href={props.backHref} prefetch={false} className={styles.backLink}>
              <ArrowLeft size={16} />
              {props.backLabel}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
