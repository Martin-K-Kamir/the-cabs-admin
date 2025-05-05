export type StatsItem = {
    label: string;
    value: string;
    trend: string;
    trendNum: number;
    trendPercentage: number;
};

export type StatsRecord = {
    kind: "money" | "percentage" | "number";
    label: string;
    current: number;
    prev: number;
    trend: number;
    trendPercentage: number;
};

export type PeriodUnit = "h" | "d" | "w" | "m" | "y";
export type PeriodRange = `${number}${PeriodUnit}`;
export type PeriodList = [PeriodRange, ...PeriodRange[]];
