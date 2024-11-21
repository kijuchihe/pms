import Layout from '@/shared/components/Layout';
import { Sidebar } from '@/shared/components/layout/sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Layout>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </Layout>

    </div>
  );
}