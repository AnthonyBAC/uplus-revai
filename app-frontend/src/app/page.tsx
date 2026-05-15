import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import MainContent from "@/features/marketing/components/MainContent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <PageShell
      header={<SiteHeader mode="marketing" showCenterNav={false} />}
      footer={<SiteFooter />}
      mainClassName={styles.main}
    >
      <div className={styles.content}>
        <div className={styles.heroArea}>
          <MainContent />
        </div>
      </div>
    </PageShell>
  );
}
