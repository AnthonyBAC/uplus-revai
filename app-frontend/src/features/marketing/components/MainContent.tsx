import HeroSection from "@/features/marketing/components/HeroSection";
import DashboardPreview from "@/features/marketing/components/DashboardPreview";
import BottomBar from "@/features/marketing/components/BottomBar";
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
