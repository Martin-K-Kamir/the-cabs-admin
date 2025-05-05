import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinearChart, type ChartConfig } from "@/components/ui/chart";
import { formatCompactDate, formatCurrency } from "@/lib/utils";
import {
    getPastPeriodDates,
    parseTimePeriod,
    type PeriodRange,
} from "@/features/stats";

export type StatsSalesData = {
    date: string;
    cabinSales: number;
    breakfastSales: number;
};

export type StatsSalesChartProps = {
    periodRange: PeriodRange;
    data: StatsSalesData[];
    renderChart?: (
        data: StatsSalesData[],
        config: ChartConfig,
    ) => React.ReactNode;
};

const chartConfig = {
    cabinSales: {
        label: "Cabin sales",
        color: "hsl(var(--chart-1))",
    },
    breakfastSales: {
        label: "Breakfast sales",
        color: "hsl(var(--chart-2))",
    },
};

export function StatsSalesChart({
    data,
    periodRange,
    renderChart,
}: StatsSalesChartProps) {
    const period = parseTimePeriod(periodRange);
    const [startOfCurrentPeriod, endOfCurrentPeriod] = getPastPeriodDates(
        period.days,
    );

    return (
        <Card className="relative !p-6">
            <CardHeader className="!p-0">
                <CardTitle className="text-xl">
                    Sales for {period.original} {period.frame}
                    {period.original > 1 ? "s" : ""}
                </CardTitle>
                <CardDescription className="text-zinc-700 dark:text-zinc-300">
                    {formatCompactDate(startOfCurrentPeriod)} -{" "}
                    {formatCompactDate(endOfCurrentPeriod)}
                </CardDescription>
            </CardHeader>
            <CardContent className="!p-0">
                {renderChart?.(data, chartConfig) ?? (
                    <LinearChart
                        data={data}
                        config={chartConfig}
                        formatters={{
                            tooltipValue: value =>
                                formatCurrency(Number(value)),
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
