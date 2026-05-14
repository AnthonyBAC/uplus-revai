import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import SettingsForm from "./SettingsForm";
import styles from "./settings.module.css";

export default function SettingsPage() {
  return (
    <PageShell
      header={<SiteHeader mode="simple" backHref="/dashboard" backLabel="Volver al dashboard" />}
      footer={<SiteFooter />}
      mainClassName={styles.main}
    >
      <SettingsForm />
    </PageShell>
  );
}