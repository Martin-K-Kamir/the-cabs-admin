import { Row } from "@tanstack/react-table";
import { type BookingColumnItem } from "@/features/bookings";

type BookingColumnGuestType = {
    row: Row<BookingColumnItem>;
} & Omit<React.ComponentProps<"span">, "children">;

export function BookingColumnGuest({ row, ...props }: BookingColumnGuestType) {
    const { email, name } = row.original.guests;

    return (
        <span {...props}>
            <span className="font-semibold text-nowrap">{name}</span> <br />{" "}
            <span className="text-nowrap text-zinc-700 dark:text-zinc-300">
                {email}
            </span>
        </span>
    );
}
