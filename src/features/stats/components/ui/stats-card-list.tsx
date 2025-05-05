import { cn } from "@/lib/utils";
import {
    StatsCardItem,
    createStatsList,
    parseTimePeriod,
    type StatsRecord,
    type PeriodRange,
    type StatsItem,
} from "@/features/stats";

export type StatsCardItemProps = {
    data: Record<string, StatsRecord>;
    periodRange: PeriodRange;
    classNameCardItem?: string;
    isLoading?: boolean;
    isPending?: boolean;
    children?: (statsItem: StatsItem) => React.ReactNode;
} & React.ComponentProps<"div">;

export function StatsCardsList({
    data,
    periodRange,
    className,
    classNameCardItem,
    isLoading,
    isPending,
    children,
    ...props
}: StatsCardItemProps) {
    const period = parseTimePeriod(periodRange);
    const stats = createStatsList(data);

    return (
        <div
            {...props}
            className={cn(
                "grid grid-cols-1 gap-5 sm:gap-6 @2xl/main:grid-cols-2 @7xl/main:grid-cols-4",
                className,
            )}
        >
            {stats.map(statsItem =>
                children ? (
                    children(statsItem)
                ) : (
                    <StatsCardItem
                        key={statsItem.label}
                        {...statsItem}
                        periodFrame={period.frame}
                        period={period.original}
                        isLoading={isLoading}
                        isPending={isPending}
                    />
                ),
            )}
        </div>
    );
}
