export function calcTrendPercentage(current: number, prev: number) {
    if (prev === 0) {
        return current === 0 ? 0 : 100;
    }

    return Math.round(((current - prev) / prev) * 100);
}
