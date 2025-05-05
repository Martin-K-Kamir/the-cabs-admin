import { type BookingId } from "@/features/bookings";

export function assertBookingIdExists(id: unknown): asserts id is BookingId {
    if (Number.isNaN(Number(id))) {
        throw new Error("Booking ID is not a number");
    }
}
