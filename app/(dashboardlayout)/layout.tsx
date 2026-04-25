import { SidebarProvider } from "@/components/ui/sidebar";

import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider
            style={{
                "--sidebar-width-icon": "54px",
            } as React.CSSProperties}
        >
            <DashboardSidebar />
            <main className="flex min-h-svh flex-1 flex-col overflow-hidden bg-background">
                <DashboardNavbar />
                <div className="flex-1 overflow-auto bg-background">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default Layout;