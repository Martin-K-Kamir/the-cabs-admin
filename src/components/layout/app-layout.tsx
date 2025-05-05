import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppNavigationMenu } from "@/components/layout/app-navigation-menu";

export function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="w-full bg-zinc-100 text-zinc-950 dark:bg-zinc-925 dark:text-zinc-50">
                <AppNavigationMenu />
                <div className="flex flex-1 flex-col py-8 sm:py-14">
                    <div className="@container/main">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
