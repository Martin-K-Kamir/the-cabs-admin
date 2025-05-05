import { useMemo } from "react";

export function usePromiseResolvers<T>(...deps: React.DependencyList) {
    const { promise, resolve, reject } = useMemo(() => {
        return Promise.withResolvers<T>();
    }, deps);
    return [promise, resolve, reject] as const;
}
