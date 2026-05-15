"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import BrandLogo from "@/components/layout/BrandLogo";
import styles from "./AuthLayout.module.css";

type Props = {
  topLinkText: string;
  topLinkCta: string;
  topLinkHref: string;
  rightPanel: ReactNode;
  children: ReactNode;
};

export default function AuthLayout({ topLinkText, topLinkCta, topLinkHref, rightPanel, children }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: "easeOut" as const },
        };

  const revealRight = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.55, delay: 0.08, ease: "easeOut" as const },
      };

  return (
    <div className={styles.page}>
      <div className={styles.split}>
        <div className={styles.formSide}>
          <motion.div className={styles.formHeader} {...reveal(0)}>
            <Link href="/" className={styles.brandLink}>
              <BrandLogo variant="default" />
            </Link>
            <p className={styles.topLink}>
              {topLinkText}{" "}
              <Link href={topLinkHref}>{topLinkCta}</Link>
            </p>
          </motion.div>

          <motion.div className={styles.formContent} {...reveal(0.1)}>
            <div className={styles.formInner}>{children}</div>
          </motion.div>

          <motion.div className={styles.formFooter} {...reveal(0.2)}>
            <span>© 2026 U+ Revai</span>
            <div className={styles.footerLinks}>
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
              <a href="#">Soporte</a>
            </div>
          </motion.div>
        </div>

        <motion.div className={styles.rightSide} {...revealRight}>
          <div className={styles.rightContent}>{rightPanel}</div>
        </motion.div>
      </div>
    </div>
  );
}
