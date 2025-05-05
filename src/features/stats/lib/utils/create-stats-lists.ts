import { getNumberFormatter } from "@/lib/utils";
import { type StatsItem, type StatsRecord } from "@/features/stats";

export function createStatsList(data: Record<string, StatsRecord>) {
    return Object.values(data).map(stat => {
        const formater = getNumberFormatter(stat.kind);

        return {
            label: stat.label,
            value: formater(stat.current),
            trend: formater(Math.abs(stat.trend)),
            trendNum: stat.trend,
            trendPercentage: stat.trendPercentage,
        } satisfies StatsItem;
    });
}
