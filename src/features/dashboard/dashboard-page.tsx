import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Wrapper } from "@/components/ui/wrapper";
import { formatCurrency } from "@/lib/utils";
import { LinearChart } from "@/components/ui/chart";
import { ErrorMessage } from "@/components/ui/error-message";
import {
    useStatsQuery,
    StatsCardsList,
    StatsSalesChart,
    StatsTogglePeriod,
    parseTimePeriod,
    StatsSelectPeriod,
} from "@/features/stats";
import { Loader } from "@/components/ui/loader";
import { bookingColumns, getRecentBookings } from "@/features/bookings/";
import {
    DataTable,
    DataTableContent,
    DataTableFilterInput,
    DataTablePagination,
    DataTableViewOptions,
} from "@/components/ui/data-table";

export function DashboardPage() {
    const [periodRange, setPeriodRange] = useState<"7d" | "30d" | "3m">("30d");
    const period = parseTimePeriod(periodRange);
    const {
        charts,
        stats,
        isLoading: statsIsLoading,
        isPending: statsIsPending,
        error: statsError,
    } = useStatsQuery({
        periodDays: period.days,
    });

    const {
        data: bookings,
        error: bookingsError,
        isPending: bookingsIsPending,
    } = useQuery({
        queryKey: ["bookings", "recent"],
        queryFn: () => getRecentBookings(),
    });

    const error = statsError || bookingsError;

    if (bookingsIsPending || statsIsLoading) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <Loader />
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <ErrorMessage error={error} />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="space-y-5 sm:space-y-6">
            <StatsSelectPeriod
                classNameTrigger="xs:hidden"
                value={periodRange}
                onChange={setPeriodRange}
                values={["7d", "30d", "3m"]}
                labels={{
                    "7d": "Last 7 days",
                    "30d": "Last 30 days",
                    "3m": "Last 3 months",
                }}
            />

            <StatsCardsList
                data={stats}
                periodRange={periodRange}
                isPending={statsIsPending}
            />

            <div className="relative">
                <StatsSalesChart
                    data={charts.totalSales.current}
                    periodRange={periodRange}
                    renderChart={(data, config) => (
                        <LinearChart
                            data={data}
                            config={config}
                            formatters={{
                                tooltipValue: value =>
                                    formatCurrency(Number(value)),
                            }}
                        />
                    )}
                />

                <StatsSelectPeriod
                    classNameTrigger="absolute top-6 right-6 hidden xs:flex md:hidden"
                    value={periodRange}
                    onChange={setPeriodRange}
                    values={["7d", "30d", "3m"]}
                    labels={{
                        "7d": "Last 7 days",
                        "30d": "Last 30 days",
                        "3m": "Last 3 months",
                    }}
                />

                <StatsTogglePeriod
                    className="absolute top-6 right-6 hidden md:block"
                    value={periodRange}
                    onChange={setPeriodRange}
                    values={["7d", "30d", "3m"]}
                    labels={{
                        "7d": "Last 7 days",
                        "30d": "Last 30 days",
                        "3m": "Last 3 months",
                    }}
                />
            </div>

            <div className="mt-12 space-y-5 sm:space-y-6">
                <DataTable columns={bookingColumns} data={bookings}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold">
                            Recent Bookings
                        </h2>
                        <div className="flex items-center gap-4">
                            <DataTableFilterInput
                                columnId="guest"
                                placeholder="Filter guest name..."
                                className="max-w-auto w-full border-zinc-300 bg-white sm:w-64 dark:bg-zinc-900"
                            />
                            <DataTableViewOptions />
                        </div>
                    </div>

                    <DataTableContent />

                    <DataTablePagination className="ml-auto" />
                </DataTable>
            </div>
        </Wrapper>
    );
}

export default DashboardPage;
