import { cn } from "@/lib/utils";

export function View({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("grid min-h-svh place-items-center", className)}
        />
    );
}
