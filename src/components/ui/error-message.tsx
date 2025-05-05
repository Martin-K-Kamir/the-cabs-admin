import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";
import React from "react";

const ERROR_MESSAGE =
    "An error occurred while fetching the data. Please try again later.";

export type ErrorMessageProps = {
    error?: Error | string;
    classNameIcon?: string;
    classNameDescription?: string;
    renderIcon?: React.ReactNode;
    renderDescription?: React.ReactNode;
} & React.ComponentProps<"div">;

export function ErrorMessage({
    className,
    classNameIcon,
    classNameDescription,
    error = ERROR_MESSAGE,
    renderIcon,
    renderDescription,
    children,
    ...props
}: ErrorMessageProps) {
    return (
        <div
            {...props}
            className={cn("flex flex-col items-center text-center", className)}
        >
            {renderIcon ? (
                renderIcon
            ) : (
                <TriangleAlertIcon
                    className={cn(
                        "size-6 text-rose-600 dark:text-rose-500",
                        classNameIcon,
                    )}
                />
            )}
            {renderDescription ? (
                renderDescription
            ) : (
                <p
                    className={cn(
                        "mt-2 max-w-prose font-semibold text-balance whitespace-pre-wrap text-rose-600 dark:text-rose-500",
                        classNameDescription,
                    )}
                >
                    {error instanceof Error ? error.message : error}
                </p>
            )}
            {children}
        </div>
    );
}
