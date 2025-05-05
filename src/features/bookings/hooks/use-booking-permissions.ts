import { endOfDay, startOfDay } from "date-fns";
import {
    type BookingItem,
    type BookingPaymentProps,
} from "@/features/bookings";

type UseBookingPermissionsProps = BookingPaymentProps &
    Pick<BookingItem, "status" | "startDate" | "endDate">;

export function useBookingPermissions({
    status,
    startDate,
    endDate,
    totalPrice,
    totalPaid,
}: UseBookingPermissionsProps) {
    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));
    const today = startOfDay(new Date());
    const isCurrentDateInRange = start <= today && today <= end;
    const isInFuture = today < start;
    const isInPast = today > end;
    const isBookingPaid = !!(
        totalPaid &&
        totalPrice &&
        totalPaid >= totalPrice
    );

    return {
        canCancel: status === "pending" || status === "confirmed",
        canConfirm:
            status === "pending" && (isInFuture || isCurrentDateInRange),
        canCheckIn:
            status === "confirmed" && isCurrentDateInRange && isBookingPaid,
        canCheckOut:
            status === "checked-in" &&
            (isCurrentDateInRange || isInPast) &&
            isBookingPaid,
        canConfirmPayment:
            status === "confirmed" && isCurrentDateInRange && !isBookingPaid,
        canUpdate:
            status === "confirmed" && (isInFuture || isCurrentDateInRange),
        canDelete: status === "canceled",
        isBookingPaid,
    };
}
