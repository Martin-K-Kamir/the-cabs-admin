import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { type BookingStatus } from "@/features/bookings";

const bookingDetailBadgeVariants = cva("px-3 py-1", {
    variants: {
        color: {
            confirmed: "bg-emerald-600 dark:!bg-emerald-500",
            "checked-in": "!bg-sky-600 dark:!bg-sky-500",
            "checked-out": "!bg-pink-600 dark:!bg-pink-500",
            canceled: "!bg-zinc-600 dark:!bg-zinc-400",
            pending: "!bg-yellow-600 dark:!bg-yellow-500",
        } as const satisfies Record<BookingStatus, string>,
    },
});

type BookingDetailBadgeProps = {
    status: BookingStatus;
} & React.ComponentProps<typeof Badge> &
    VariantProps<typeof bookingDetailBadgeVariants>;

export function BookingDetailBadge({
    status,
    className,
    color,
    ...props
}: BookingDetailBadgeProps) {
    return (
        <Badge
            {...props}
            className={cn(
                bookingDetailBadgeVariants({ color: status, className }),
            )}
        >
            {status}
        </Badge>
    );
}
