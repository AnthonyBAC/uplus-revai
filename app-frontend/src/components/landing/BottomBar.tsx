"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./BottomBar.module.css";

export default function BottomBar() {
  const prefersReducedMotion = useReducedMotion();

  const getReveal = (index: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.48,
            delay: 0.28 + index * 0.08,
            ease: "easeOut" as const,
          },
        };

  return (
    <motion.section className={styles.section} {...getReveal(0)}>
      <motion.div className={styles.sectionHeader} {...getReveal(0)}>
        <span className={styles.sectionLabel}>Cómo funciona</span>
      </motion.div>

      <div className={styles.bottomBar}>
        <motion.div className={styles.step} {...getReveal(1)}>
          <div className={styles.stepDigit}>01</div>
          <div className={styles.stepText}>
            <span className={styles.stepTitle}>Conectas tus reseñas</span>
            <span className={styles.stepSubtitle}>Google Reviews</span>
            <span className={styles.stepDescription}>
              Centraliza tus opiniones en un solo lugar para leer todo sin
              saltar entre plataformas.
            </span>
          </div>
        </motion.div>

        <motion.div className={styles.step} {...getReveal(2)}>
          <div className={styles.stepDigit}>02</div>
          <div className={styles.stepText}>
            <span className={styles.stepTitle}>La IA encuentra patrones</span>
            <span className={styles.stepSubtitle}>Patrones y oportunidades</span>
            <span className={styles.stepDescription}>
              Detecta repeticiones, señales de alerta y fortalezas que impactan
              la experiencia real de tus clientes.
            </span>
          </div>
        </motion.div>

        <motion.div className={styles.step} {...getReveal(3)}>
          <div className={styles.stepDigit}>03</div>
          <div className={styles.stepText}>
            <span className={styles.stepTitle}>Plan semanal</span>
            <span className={styles.stepSubtitle}>Acciones priorizadas</span>
            <span className={styles.stepDescription}>
              Recibes un enfoque claro con mejoras concretas para ejecutar
              primero lo que más mueve el negocio.
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
