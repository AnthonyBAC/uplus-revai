"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Eye,
  House,
  Star,
  TrendingUp,
} from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import styles from "./DashboardPreview.module.css";

export default function DashboardPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.dashboardPreview}
      initial={prefersReducedMotion ? false : { opacity: 0, x: 24, scale: 0.985 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
    >
      <div className={styles.dashboardCard}>
        <div className={styles.dashboardToolbar}>
          <div className={styles.toolbarDots}>
            <span className={`${styles.toolbarDot} ${styles.toolbarDotRed}`} />
            <span
              className={`${styles.toolbarDot} ${styles.toolbarDotYellow}`}
            />
            <span
              className={`${styles.toolbarDot} ${styles.toolbarDotGreen}`}
            />
          </div>
          <div className={styles.toolbarUrl}>app.revai.cl/dashboard</div>
          <div style={{ width: 46 }} />
        </div>

        <div className={styles.dashboardContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarBrand}>
              <BrandLogo variant="pastel" />
            </div>
            <div
              className={styles.sidebarItem}
            >
              <span className={styles.sidebarIcon}>
                <BarChart3 size={14} />
              </span>
              Resumen
            </div>
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarIcon}>
                <Star size={14} />
              </span>
              Reseñas
            </div>
            <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>
              <span className={styles.sidebarIcon}>
                <TrendingUp size={14} />
              </span>
              Mejoras
            </div>
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarIcon}>
                <Eye size={14} />
              </span>
              Insights
            </div>
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarIcon}>
                <House size={14} />
              </span>
              Local
            </div>
          </aside>

          <main className={styles.mainArea}>
            <div className={styles.mainHeader}>
              <h3 className={styles.mainTitle}>
                Tus mejoras esta semana
              </h3>
              <span className={styles.mainBadge}>
                + 12 reseñas
              </span>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Rating prom.</div>
                <div className={styles.statValue}>4.3</div>
                <div className={styles.statChange}>+0.4 vs mes ant.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Reseñas</div>
                <div className={styles.statValue}>87</div>
                <div className={styles.statChange}>+12 esta semana</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Acciones</div>
                <div className={styles.statValue}>5</div>
                <div className={styles.statChange}>3 prioritarias</div>
              </div>
            </div>

            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <span className={styles.insightLabel}>Acción sugerida</span>
                <span className={styles.insightAi}>IA</span>
              </div>

              <h4 className={styles.insightTitle}>
                Mejorar tiempos de espera en el almuerzo
              </h4>

              <p className={styles.insightDescription}>
                6 reseñas de los últimos 14 días mencionan esperas largas entre
                13:00 y 14:00. Pasos sugeridos: precargar pedidos y sumar apoyo
                en hora punta.
              </p>

              <div className={styles.insightTags}>
                <span className={styles.insightTagPrimary}>Impacto alto</span>
                <span className={styles.insightTag}>3 pasos</span>
                <span className={styles.insightTag}>~2 semanas</span>
              </div>
            </div>

            <div className={styles.reviewsList}>
              <div className={styles.reviewCard}>
                <div className={styles.reviewAvatar}>M</div>
                <div className={styles.reviewBody}>
                  <div className={styles.reviewTopLine}>
                    <span className={styles.reviewName}>María C.</span>
                    <span className={styles.reviewStars}>★★★★★</span>
                  </div>
                  <p className={styles.reviewText}>
                    Comida excelente, pero <mark>esperamos 30 min</mark> para
                    que nos atendieran.
                  </p>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <div className={styles.reviewAvatar}>J</div>
                <div className={styles.reviewBody}>
                  <div className={styles.reviewTopLine}>
                    <span className={styles.reviewName}>Juan P.</span>
                    <span className={styles.reviewStars}>★★★★★</span>
                  </div>
                  <p className={styles.reviewText}>
                    Mejor café del barrio, el equipo súper atento, volveremos
                    seguro.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
}
