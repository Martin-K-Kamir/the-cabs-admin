import { useEffect } from "react";
import { useThemeStore } from "@/features/theme";

export function useTheme() {
    const theme = useThemeStore(state => state.theme);
    const setTheme = useThemeStore(state => state.setTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";

        root.style.colorScheme = theme || systemTheme;
        root.classList.remove("light", "dark");
        root.classList.add(theme || systemTheme);
        setTheme(theme || systemTheme);
    }, [theme]);
}
