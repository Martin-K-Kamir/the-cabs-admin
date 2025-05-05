import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Loader({
    delay = 500,
    className,
    ...props
}: {
    delay?: number;
    className?: string;
} & React.ComponentProps<typeof LoaderCircleIcon>) {
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoaderVisible(true);
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    if (!isLoaderVisible) {
        return null;
    }

    return (
        <LoaderCircleIcon
            {...props}
            className={cn(
                "size-12 animate-spin text-blue-600 dark:text-blue-700",
                className,
            )}
        />
    );
}
