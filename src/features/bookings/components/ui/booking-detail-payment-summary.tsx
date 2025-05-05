import { cva, type VariantProps } from "class-variance-authority";
import { cn, formatCurrency } from "@/lib/utils";
import {
    createBookingPaymentList,
    type BookingPaymentItem,
    type BookingPaymentProps,
} from "@/features/bookings";

type BookingDetailPaymentSummaryProps = {
    data: BookingPaymentProps;
    labels?: [
        paymentConfirmedLabel?: string,
        paymentPendingLabel?: string,
        paymentRefundedLabel?: string,
    ];
} & Omit<React.ComponentProps<"div">, "children">;

export function BookingDetailPaymentSummary({
    data,
    className,
    labels,
    ...props
}: BookingDetailPaymentSummaryProps) {
    const [paymentConfirmed, paymentPending, paymentRefunded] =
        createBookingPaymentList(data);
    const [paymentConfirmedLabel, paymentPendingLabel, paymentRefundedLabel] =
        labels ?? [];

    return (
        <div {...props} className={cn("space-y-4", className)}>
            <BookingDetailPaymentCard
                list={paymentConfirmed}
                label={paymentConfirmedLabel ?? "Payment confirmed"}
                color="green"
            />
            <BookingDetailPaymentCard
                list={paymentPending}
                label={paymentPendingLabel ?? "Payment pending"}
                color="rose"
            />
            <BookingDetailPaymentCard
                list={paymentRefunded}
                label={paymentRefundedLabel ?? "Payment refunded"}
                color="indigo"
            />
        </div>
    );
}

const bookingDetailPaymentCardVariants = cva(
    "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between rounded-lg border px-5 py-4 font-medium text-white dark:text-zinc-50",
    {
        variants: {
            color: {
                default:
                    "border-zinc-500 bg-zinc-700 dark:border-zinc-500 dark:bg-zinc-800",
                green: "border-green-500 bg-green-700 dark:border-green-500 dark:bg-green-800",
                rose: "border-rose-500 bg-rose-700 dark:border-rose-500 dark:bg-rose-800",
                indigo: "border-indigo-500 bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-800",
            },
        },
        defaultVariants: {
            color: "default",
        },
    },
);

type BookingDetailPaymentCardProps<TItem extends BookingPaymentItem> = {
    list: TItem[];
    label: string;
} & Omit<React.ComponentProps<"div">, "children"> &
    VariantProps<typeof bookingDetailPaymentCardVariants>;

export function BookingDetailPaymentCard<TItem extends BookingPaymentItem>({
    className,
    list,
    label,
    color,
    ...props
}: BookingDetailPaymentCardProps<TItem>) {
    if (list.length === 0) {
        return null;
    }

    const totalPrice = list.reduce((acc, item) => {
        return acc + (item.price <= 0 ? 0 : item.price);
    }, 0);

    if (totalPrice <= 0) {
        return;
    }

    return (
        <div
            {...props}
            className={cn(
                bookingDetailPaymentCardVariants({ color, className }),
            )}
        >
            <ul className="flex flex-col-reverse gap-[1px] sm:flex-col">
                <li className="mt-1.5 border-t border-zinc-50/80 py-1 sm:mt-0 sm:mb-0.5 sm:border-0 sm:py-0">
                    Total: {formatCurrency(totalPrice)}
                </li>
                {list.map(item => {
                    if (item.price <= 0) {
                        return null;
                    }

                    return (
                        <li key={item.label} className="text-sm font-normal">
                            {item.label} {formatCurrency(item.price)}
                        </li>
                    );
                })}
            </ul>
            <p className="mb-2 sm:mb-0">{label}</p>
        </div>
    );
}
