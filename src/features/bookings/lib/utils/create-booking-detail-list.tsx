import {
    CalendarIcon,
    CoffeeIcon,
    HouseIcon,
    MessageCircleIcon,
    PhoneIcon,
    UsersIcon,
} from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { type BookingItem } from "@/features/bookings";

export function createBookingDetailList(data: BookingItem) {
    const {
        cabins,
        guests,
        numOfGuests,
        startDate,
        endDate,
        observations,
        isBreakfast,
    } = data;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numOfNights = differenceInCalendarDays(end, start);

    return [
        {
            label: "Cabin",
            value: cabins.name,
            icon: <HouseIcon className="size-4" />,
        },
        {
            label: "Guest",
            value: `${guests.name} ${numOfGuests >= 2 ? "+" : ""} ${numOfGuests >= 2 ? numOfGuests - 1 : ""} ${numOfGuests > 3 ? "guests" : numOfGuests >= 2 ? "guest" : ""}`,
            icon: <UsersIcon className="size-4" />,
        },
        {
            label: "Contact",
            value: `${guests.email}, ${guests.phone}`,
            icon: <PhoneIcon className="size-4" />,
        },
        {
            label: "Date",
            value: `${numOfNights} nights from ${format(start, "cccccc")} ${format(start, "P")} to ${format(end, "cccccc")} ${format(end, "P")}`,
            icon: <CalendarIcon className="size-4" />,
        },
        ...(observations
            ? [
                  {
                      label: "Observations",
                      value: observations,
                      icon: <MessageCircleIcon className="size-4" />,
                  },
              ]
            : []),
        {
            label: "Breakfast",
            value: isBreakfast ? "Yes" : "No",
            icon: <CoffeeIcon className="size-4" />,
        },
    ];
}
