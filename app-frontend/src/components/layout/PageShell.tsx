"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import styles from "./PageShell.module.css";

type PageShellProps = {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  mainClassName?: string;
};

export default function PageShell({
  header,
  children,
  footer,
  mainClassName,
}: PageShellProps) {
  const prefersReducedMotion = useReducedMotion();
  const mainClasses = [styles.main, styles.mainCompact, mainClassName]
    .filter(Boolean)
    .join(" ");

  const animation = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.page}>
        <div className={styles.clipHost}>
          <m.div transition={{ duration: 0.45, ease: "easeOut" }} {...animation}>
            {header}
          </m.div>
          <m.main
            className={mainClasses}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            {...animation}
          >
            {children}
          </m.main>
          <m.div
            transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
            {...animation}
          >
            {footer}
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}
