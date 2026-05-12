import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "pastel";
};

export default function BrandLogo({
  className,
  variant = "default",
}: BrandLogoProps) {
  const classes = [styles.brand, className].filter(Boolean).join(" ");
  const markClass = variant === "pastel" ? styles.markPastel : styles.markDefault;

  return (
    <span className={classes}>
      <span className={`${styles.mark} ${markClass}`} aria-hidden="true">
        <span className={styles.u}>U</span>
        <span className={styles.plus}>+</span>
      </span>
      <span className={styles.label}>Revai</span>
    </span>
  );
}
