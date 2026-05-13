import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import RegisterForm from "./RegisterForm";
import styles from "./register.module.css";

export default function RegisterPage() {
  return (
    <PageShell
      header={<SiteHeader mode="simple" backHref="/" backLabel="Volver al inicio" />}
      footer={<SiteFooter />}
      mainClassName={styles.main}
    >
      <RegisterForm />
    </PageShell>
  );
}