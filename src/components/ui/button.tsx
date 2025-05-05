import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "outline-none focus-visible:ring-2 inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 aria-invalid:border-rose-600 aria-invalid:ring-rose-500/50 aria-invalid:focus-visible:ring-[3px] dark:aria-invalid:border-rose-800 dark:aria-invalid:ring-rose-800 dark:aria-invalid:focus-visible:ring-2",
    {
        variants: {
            variant: {
                default:
                    "border border-blue-400 bg-blue-600 text-zinc-50 ring-blue-400 shadow-sm hover:bg-blue-500 dark:border-blue-500 dark:bg-blue-700 dark:text-zinc-50 dark:hover:bg-blue-600 dark:ring-blue-400",
                destructive:
                    "border border-rose-500 bg-rose-700 text-zinc-50 ring-rose-500 shadow-xs hover:bg-rose-600 dark:border-rose-500 dark:bg-rose-800 dark:text-zinc-50 dark:hover:bg-rose-700 dark:ring-rose-600",
                outline:
                    "border border-zinc-300 bg-white ring-zinc-800/70 shadow-xs hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:ring-zinc-300/30",
                secondary:
                    "border border-zinc-300 bg-zinc-200 text-zinc-800 ring-zinc-800/70 shadow-xs hover:bg-zinc-200/50 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/70 dark:border-zinc-700 dark:ring-zinc-300/30",
                ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-100 ring-zinc-800/70 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:ring-zinc-300/30",
                link: "text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
