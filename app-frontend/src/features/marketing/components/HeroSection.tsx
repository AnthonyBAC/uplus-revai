"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ArrowRight, PlayCircle, Check } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const getReveal = (index: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.48,
            delay: 0.1 + index * 0.08,
            ease: "easeOut" as const,
          },
        };

  return (
    <LazyMotion features={domAnimation}>
      <m.div className={styles.heroText} {...getReveal(0)}>
        <m.div className={styles.heroBadge} {...getReveal(0)}>
          <span className={styles.heroBadgeIcon}>✦</span>
          Review Intelligence para tu negocio
        </m.div>

        <m.h1 className={styles.heroTitle} {...getReveal(1)}>
          Tus reseñas, leídas por IA y convertidas en{" "}
          <span className={styles.heroTitleHandwritten}>mejoras reales.</span>
        </m.h1>

        <m.p className={styles.heroSubtitle} {...getReveal(2)}>
          U+ Revai junta todas las reseñas de tu negocio, las analiza con IA y
          te entrega un plan de acción semanal con qué cambiar, cómo y por qué.
        </m.p>

        <m.div className={styles.heroActions} {...getReveal(3)}>
          <Link href="/demo" prefetch={false} className={styles.heroCtaPrimary}>
            Probar 14 días gratis
            <ArrowRight size={16} />
          </Link>
          <Link href="/demo" prefetch={false} className={styles.heroCtaSecondary}>
            <PlayCircle size={16} />
            Ver demo
          </Link>
        </m.div>

        <m.div className={styles.heroChecks} {...getReveal(4)}>
          <span className={styles.heroCheck}>
            <Check size={13} className={styles.heroCheckIcon} /> Sin tarjeta
          </span>
          <span className={styles.heroCheck}>
            <Check size={13} className={styles.heroCheckIcon} /> Setup en 5 min
          </span>
          <span className={styles.heroCheck}>
            <Check size={13} className={styles.heroCheckIcon} /> Google
          </span>
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
