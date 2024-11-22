import Layout from '@/shared/components/layout';
import { Sidebar } from '@/shared/components/layout/sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}