import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useDelayedLoading,
    type UseDelayedLoadingProps,
} from "@/hooks/use-delayed-loading";
import { cn, formatPercentage } from "@/lib/utils";
import { type StatsItem } from "@/features/stats";

export type StatsCardProps = {
    period: number;
    periodFrame: "hour" | "day" | "week" | "month" | "year";
} & React.ComponentProps<typeof Card> &
    UseDelayedLoadingProps &
    StatsItem;

export function StatsCardItem({
    value,
    label,
    period,
    periodFrame,
    trend,
    trendNum,
    trendPercentage,
    className,
    isLoading,
    isPending,
    ...props
}: StatsCardProps) {
    const { loading } = useDelayedLoading({ isLoading, isPending });
    const isTrendingUp = trendPercentage > 0;
    const isTrendingDown = trendPercentage < 0;

    const symbol = isTrendingUp ? "+" : isTrendingDown ? "-" : "";

    const icon = isTrendingUp ? (
        <TrendingUpIcon className="size-4" />
    ) : isTrendingDown ? (
        <TrendingDownIcon className="size-4" />
    ) : null;

    const trendingMessage = isTrendingUp
        ? "Trending up"
        : isTrendingDown
          ? "Trending down"
          : "No change";

    return (
        <Card
            {...props}
            className={cn("@container/card relative !p-5 sm:!p-6", className)}
        >
            <CardHeader className="!p-0">
                <CardDescription className="text-zinc-700 dark:text-zinc-300">
                    {label}
                </CardDescription>
                <CardTitle className="relative text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <span className={cn(loading && "opacity-0")}>{value}</span>
                    {loading && (
                        <Skeleton className="absolute bottom-0 left-0 h-[calc(100%-0.325rem)] w-[50%]" />
                    )}
                </CardTitle>
                {!loading && (
                    <div className="absolute top-4 right-4">
                        <StatsCardBadge value={trendPercentage} />
                    </div>
                )}
            </CardHeader>
            {!loading && (
                <CardFooter className="flex-col items-start gap-1 !p-0 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {trendingMessage} this {period}{" "}
                        {period > 1 ? `${periodFrame}s` : periodFrame}
                        {icon}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                        {symbol}
                        {trend} from previous period
                    </div>
                </CardFooter>
            )}
            {loading && (
                <div className="space-y-2">
                    <Skeleton className="h-5 w-[65%]" />
                    <Skeleton className="h-5 w-[85%]" />
                </div>
            )}
        </Card>
    );
}

export function StatsCardBadge({
    value,
    ...props
}: { value: number } & React.ComponentProps<typeof Badge>) {
    const isUp = value > 0;
    const isDown = value < 0;
    const isZero = value === 0;

    const icon = isUp ? (
        <TrendingUpIcon className="size-3" />
    ) : isDown ? (
        <TrendingDownIcon className="size-3" />
    ) : null;
    const symbol = isUp ? "+" : isDown ? "-" : "";

    return (
        <Badge
            {...props}
            variant="outline"
            className={cn(
                "flex gap-1 rounded-md px-2 py-1 text-xs text-white",
                isUp &&
                    "border-emerald-400 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-700",
                isDown &&
                    "border-rose-400 bg-rose-600 dark:border-rose-500 dark:bg-rose-700",
                isZero &&
                    "border-zinc-400 bg-zinc-600 dark:border-zinc-500 dark:bg-zinc-700",
            )}
        >
            {icon}
            {symbol}
            {formatPercentage(Math.abs(value))}
        </Badge>
    );
}
