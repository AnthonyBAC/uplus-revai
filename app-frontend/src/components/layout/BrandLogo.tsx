import type { CSSProperties } from "react";
import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "pastel";
  style?: CSSProperties;
};

export default function BrandLogo({ className, variant = "default", style }: BrandLogoProps) {
  const src = variant === "pastel" ? "/Revai_v2.webp" : "/Revai_v1.webp";
  const classes = [styles.logo, className].filter(Boolean).join(" ");

  return (
    <img
      src={src}
      alt="U+ Revai"
      className={classes}
      style={style}
    />
  );
}
