import styles from "./SiteFooter.module.css";
import BrandLogo from "./BrandLogo";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <BrandLogo variant="pastel" />
        </div>
        <div className={styles.links}>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
        </div>
        <span className={styles.copy}>© 2025 Revai</span>
      </div>
    </footer>
  );
}
