import { Sidebar, Header } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <div className="pl-64">
        <Header title="Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
