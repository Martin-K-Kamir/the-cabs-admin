import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(
        null,
    );

    useEffect(() => {
        const element = document.createElement("div");
        element.id = "toaster-portal";
        document.body.insertBefore(element, document.body.lastChild);
        setPortalElement(element);

        return () => {
            document.body.removeChild(element);
        };
    }, []);

    if (!portalElement) return null;

    return createPortal(
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group pointer-events-auto"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800 ",
                    description:
                        "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
                    actionButton:
                        "group-[.toast]:border! group-[.toast]:transition-colors! group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:border-zinc-100! dark:group-[.toast]:bg-zinc-100! dark:group-[.toast]:hover:bg-zinc-300! dark:group-[.toast]:text-zinc-900",
                    cancelButton:
                        "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-900 dark:group-[.toast]:text-zinc-400",
                },
            }}
            {...props}
        />,
        portalElement,
    );
};

export { Toaster };
