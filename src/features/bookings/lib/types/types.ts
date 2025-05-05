import type { CabinItem } from "@/features/cabins/lib/types";
import type { Brand } from "@/lib/types";
import { type Tables } from "@/services/supabase";

export type BookingId = Brand<Tables<"bookings">["id"], "BookingId">;
export type NewGuestItem = Omit<GuestItem, "id" | "createdAt">;
export type GuestId = Brand<Tables<"guests">["id"], "guestId">;
export type GuestItem = Omit<Tables<"guests">, "id"> & { id: GuestId };
export type BookingStatus =
    | "confirmed"
    | "checked-in"
    | "checked-out"
    | "canceled"
    | "pending";

type WithCabin = {
    cabins: CabinItem;
};

type WithCabinName = {
    cabins: { name: CabinItem["name"] };
};

type WithGuest = {
    guests: GuestItem;
};

type WithId = {
    id: BookingId;
};

type WithGuestId = {
    guestId: GuestId;
};

export type WithBookingStatus = {
    status: BookingStatus;
};

export type BaseBookingItem = Omit<
    Tables<"bookings">,
    "status" | "id" | "guestId"
> &
    WithId &
    WithBookingStatus &
    WithGuestId;

export type BookingItem = BaseBookingItem & WithCabin & WithGuest;

export type UpdateBookingItem = Partial<
    Omit<BookingItem, "cabinId" | "startDate" | "endDate"> & {
        startDate: Date | string;
        endDate: Date | string;
        cabinId: number | string;
    }
> &
    WithId;

export type NewBookingItem = Omit<
    BookingItem,
    | "id"
    | "createdAt"
    | "guests"
    | "cabins"
    | "startDate"
    | "endDate"
    | "guestId"
    | "cabinId"
> & {
    startDate: Date | string;
    endDate: Date | string;
    cabinId: number | string;
    guest: NewGuestItem;
};

export type BookingColumnItem = BaseBookingItem & WithCabinName & WithGuest;

export type BookingPaymentItem = {
    price: number;
    label: string;
};

export type BookingPaymentProps = Partial<
    Pick<
        BookingItem,
        | "isBreakfast"
        | "cabinPrice"
        | "cabinPaid"
        | "cabinRefund"
        | "breakfastPrice"
        | "breakfastPaid"
        | "breakfastRefund"
        | "totalPrice"
        | "totalPaid"
        | "totalRefund"
    >
> & {
    isNewBreakfast?: boolean;
    newBreakfastPrice?: number;
    newCabinPrice?: number;
};
