import { Params } from "react-router";
import { getParamLabel, formatPathname } from "@/lib/utils";

type Breadcrumb = { href?: string; label: string };

export function createBreadcrumbs(
    pathname: string,
    params: Readonly<Params<string>>,
): Breadcrumb[] {
    return pathname
        .split("/")
        .filter(Boolean)
        .reduce<Breadcrumb[]>((acc, segment, index, self) => {
            const paramLabel = getParamLabel(params, segment);
            const label = paramLabel ?? formatPathname(segment);

            if (index === 0) {
                acc.push({ href: "/dashboard", label: "Home" });
            }

            if (index < self.length - 1) {
                acc.push({ href: `/${segment}`, label });
            } else {
                acc.push({ label });
            }

            return acc;
        }, []);
}
