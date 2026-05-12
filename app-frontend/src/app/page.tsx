import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import MainContent from "@/components/landing/MainContent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <PageShell
      header={<SiteHeader mode="marketing" />}
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
