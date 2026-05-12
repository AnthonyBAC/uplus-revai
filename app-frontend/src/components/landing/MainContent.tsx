import HeroSection from "@/components/landing/HeroSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import BottomBar from "@/components/landing/BottomBar";
import styles from "./MainContent.module.css";

export default function MainContent() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.topRow}>
        <HeroSection />
        <DashboardPreview />
      </div>
      <div className={styles.bottomRow}>
        <BottomBar />
      </div>
    </div>
  );
}
