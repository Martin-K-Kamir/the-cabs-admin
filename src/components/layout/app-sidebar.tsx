import { useLayoutEffect } from "react";
import {
    HouseIcon,
    CalendarIcon,
    HousePlusIcon,
    UserPlusIcon,
    SettingsIcon,
    LayoutDashboardIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/ui/nav-user";
import { assertUserExists, useGetUser } from "@/features/auth";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Bookings",
        url: "/bookings",
        icon: CalendarIcon,
    },
    {
        title: "Cabins",
        url: "/cabins",
        icon: HousePlusIcon,
    },
    {
        title: "Users",
        url: "/create-user",
        icon: UserPlusIcon,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: SettingsIcon,
    },
] as const satisfies Array<{
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}>;

export function AppSidebar() {
    const location = useLocation();
    const { isMobile, setOpenMobile } = useSidebar();
    const { user } = useGetUser();

    assertUserExists(user);

    useLayoutEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [location.pathname, isMobile, setOpenMobile]);

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <HouseIcon className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-nowrap">
                                        The Cabs
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        size="default"
                                        isActive={
                                            location.pathname === item.url
                                        }
                                        tooltip={{
                                            children: item.title,
                                        }}
                                    >
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarFooter className="mt-auto">
                    <NavUser user={user} />
                </SidebarFooter>
                <SidebarRail />
            </SidebarContent>
        </Sidebar>
    );
}
