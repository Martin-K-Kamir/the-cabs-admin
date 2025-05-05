import { Params } from "react-router";
import { formatPathname } from "@/lib/utils";

export function getParamLabel(params: Readonly<Params<string>>, cur: string) {
    const param = Object.entries(params).find(([_, value]) => value === cur);

    if (param && param.length === 2) {
        const [key, value] = param;
        return `${formatPathname(key)} #${value}`;
    }

    return undefined;
}
