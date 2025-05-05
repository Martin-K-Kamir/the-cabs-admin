import { isSameDay } from "date-fns";

export function sumByDate<TData extends { createdAt: Date | string }>(
    date: Date,
    data: TData[],
    getValue: (item: TData) => number,
) {
    return data.reduce((acc, item) => {
        if (isSameDay(date, new Date(item.createdAt))) {
            return acc + getValue(item);
        }
        return acc;
    }, 0);
}
