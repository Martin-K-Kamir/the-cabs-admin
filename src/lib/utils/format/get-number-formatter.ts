import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

export function getNumberFormatter(kind: "money" | "number" | "percentage") {
    switch (kind) {
        case "money":
            return formatCurrency;
        case "number":
            return formatNumber;
        case "percentage":
            return formatPercentage;
    }
}
