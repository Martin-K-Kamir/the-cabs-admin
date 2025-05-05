import { LogOut as LogOutIcon, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/features/theme";
import { BreadcrumbResponsive } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useLogoutUser } from "@/features/auth";
import { Link } from "react-router";

export function AppNavigationMenu() {
    const { logout, isPending } = useLogoutUser();

    return (
        <header className="sticky top-0 z-50 flex w-full items-center gap-2 border-b border-zinc-200 bg-white p-2 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900">
            <Tooltip content="Toggle sidebar">
                <SidebarTrigger />
            </Tooltip>

            <Separator
                orientation="vertical"
                className="mr-3 h-5! bg-zinc-300 dark:bg-zinc-700"
            />

            <BreadcrumbResponsive />

            <div className="ml-auto hidden items-center xs:flex">
                <Tooltip content="My account">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/account">
                            <UserIcon className="size-4" />
                        </Link>
                    </Button>
                </Tooltip>

                <Tooltip content="Toggle theme">
                    <ThemeToggle />
                </Tooltip>

                <Tooltip content="Log out">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => logout()}
                        disabled={isPending}
                    >
                        <LogOutIcon className="size-4" />
                    </Button>
                </Tooltip>
            </div>
        </header>
    );
}
