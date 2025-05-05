import type { Row } from "@tanstack/react-table";
import { cn, formatCurrency } from "@/lib/utils";
import { type CabinItem } from "@/features/cabins";

type CabinColumnDiscountProps = {
    row: Row<CabinItem>;
} & Omit<React.ComponentProps<"span">, "children">;

export function CabinColumnDiscount({
    row,
    className,
    ...props
}: CabinColumnDiscountProps) {
    const discount = row.getValue("discount")
    assertDiscountExists(discount);

    return (
        <span
            {...props}
            className={cn(
                "text-nowrap",
                discount > 0 && "text-emerald-600 dark:text-emerald-500",
                className,
            )}
        >
            {discount === 0 ? "—" : formatCurrency(discount)}
        </span>
    );
}

function assertDiscountExists(discount: unknown): asserts discount is number {
    if (typeof discount !== "number") {
        throw new Error("Discount must be a number");
    }
}