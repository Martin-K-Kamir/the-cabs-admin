import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, useThemeStore } from "@/features/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({
    className,
    withText = false,
    ...props
}: React.ComponentProps<typeof Button> & {
    withText?: boolean;
}) {
    useTheme();
    const toggleTheme = useThemeStore(state => state.toggleTheme);

    return (
        <Button
            {...props}
            variant="ghost"
            size={withText ? "sm" : "icon"}
            onClick={toggleTheme}
            className={cn("transition-none", className)}
        >
            <SunIcon
                className={cn(
                    "absolute size-4 scale-0 dark:static dark:scale-100",
                )}
            />
            {withText && <span className="hidden dark:block">Light Theme</span>}
            <MoonIcon className="size-4 scale-100 dark:absolute dark:scale-0" />
            {withText && <span className="dark:hidden">Dark Theme</span>}
            {!withText && <span className="sr-only">Toggle theme</span>}
        </Button>
    );
}
