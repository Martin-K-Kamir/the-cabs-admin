export function formatPercentage(percentage: number) {
    return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(percentage / 100);
}
