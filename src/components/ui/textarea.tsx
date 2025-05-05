import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "flex field-sizing-content min-h-16 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-base text-zinc-950 shadow-xs ring-zinc-800/70 transition-[color,box-shadow] outline-none selection:bg-zinc-900 selection:text-zinc-50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-600 aria-invalid:ring-rose-500/50 aria-invalid:focus-visible:ring-[3px] md:text-sm dark:border-zinc-700 dark:bg-zinc-925 dark:text-zinc-50 dark:ring-zinc-300/30 dark:selection:bg-zinc-50 dark:selection:text-zinc-900 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:aria-invalid:border-rose-800 dark:aria-invalid:ring-rose-800 dark:aria-invalid:focus-visible:ring-2",
                className,
            )}
            {...props}
        />
    );
}

export { Textarea };
