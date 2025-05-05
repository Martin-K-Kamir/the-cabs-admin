import { Row } from "@tanstack/react-table";
import { cva, VariantProps } from "class-variance-authority";

import {
    CircleIcon,
    CircleOffIcon,
    CircleCheckBigIcon,
    UserCheckIcon,
    UserXIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    type BookingColumnItem,
    type BookingStatus,
} from "@/features/bookings";

const statusIconMap = {
    pending: <CircleIcon />,
    confirmed: <CircleCheckBigIcon />,
    "checked-in": <UserCheckIcon />,
    "checked-out": <UserXIcon />,
    canceled: <CircleOffIcon />,
} as const satisfies Record<BookingStatus, React.ReactElement>;

const bookingColumnStatusVariants = cva(
    "flex items-center text-nowrap capitalize [&>svg]:translate-y-[1px] [&>svg]:size-4 ",
    {
        variants: {
            variant: {
                pending: "text-yellow-600 dark:text-yellow-500",
                confirmed: "text-emerald-600 dark:text-emerald-500",
                "checked-in": "text-sky-600 dark:text-sky-500",
                "checked-out": "text-pink-600 dark:text-pink-500",
                canceled: "text-zinc-700 dark:text-zinc-400",
            } satisfies Record<BookingStatus, string>,
        },
    },
);

type BookingColumnStatusType = {
    row: Row<BookingColumnItem>;
} & React.HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof bookingColumnStatusVariants>;

export function BookingColumnStatus({
    row,
    variant,
    className,
    ...props
}: BookingColumnStatusType) {
    const status = row.getValue("status") as BookingStatus;

    return (
        <span
            {...props}
            className={cn(
                bookingColumnStatusVariants({ variant: status, className }),
            )}
        >
            {statusIconMap[status]}
            <span className="ml-2">{status}</span>
        </span>
    );
}
