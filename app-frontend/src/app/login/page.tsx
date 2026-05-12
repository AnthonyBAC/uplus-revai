import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function LoginPage() {
  return (
    <PageShell
      header={<SiteHeader mode="simple" backHref="/" backLabel="Volver al inicio" />}
      footer={<SiteFooter />}
    >
      <div />
    </PageShell>
  );
}
