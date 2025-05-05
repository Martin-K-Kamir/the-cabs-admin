import { useEffect, useState } from "react";

export type UseDelayedLoadingProps = {
    isLoading?: boolean;
    isPending?: boolean;
    delay?: number;
};

export function useDelayedLoading({
    isLoading,
    isPending,
    delay = 250,
}: UseDelayedLoadingProps) {
    const [delayedLoading, setDelayedLoading] = useState(false);

    useEffect(() => {
        if (isPending) {
            const timeout = setTimeout(() => {
                setDelayedLoading(true);
            }, delay);
            return () => clearTimeout(timeout);
        }

        setDelayedLoading(false);
    }, [isPending]);

    return {
        delayedLoading,
        loading: isLoading || delayedLoading,
    };
}
